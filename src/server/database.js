module.exports = {
    restartGame,
    addGameToGameList,
    getGameInfo,
    getAllGames,
    addUserToGame,
    removeUserFromGame,
    removeGame,
    handleRequestPlayerMove,
    handleChangeColorRequest,
    postingChatInfo,
};

let gameId = 0;
const gameList = [];
const initGameList = [];     // list of games that started initializing state
const PileModel = require('./logic/api-models/pile.class');
const PlayerModel = require('./logic/api-models/player.class');
const Enums = require('./enums-node');
const auth = require('./authentication');
const serverGameUtils = require("./server-game-utils");
const _ = require('lodash');

function addGameToGameList(req, res, next) {
    let newGameInfo = JSON.parse(req.body);
    newGameInfo.owner = auth.getUserInfo(req.session.id);

    const nameAlreadyExists = gameList.some((game) => game.name === newGameInfo.name);
    if (nameAlreadyExists) {
        res.status(403).send('game name already exist');
    } else {
        createNewGame(newGameInfo);
        next();
    }
}
function removeUserFromGame(req, res, next) {
    req.xData = JSON.parse(req.body);

    let currentGame = gameList.find((game) => {
        return game.name === req.xData.game.name;
    });
    if (currentGame.isActive) {
        req.xStatus = 403;
        req.xSendMessage = 'Game has already started! cannot remove player from game ';
        next();
    } else {
        let playerSeatIndex = currentGame.GameState.players.findIndex((player) => {
            return player.name === req.xData.user.name;
        });

        // delete the leaving player from player array
        currentGame.GameState.players.splice(playerSeatIndex,1);

        //add a free spot for a new player in this game
        if (currentGame.playersCapacity ===2) {
            currentGame.GameState.players.splice(1,0,'unassigned');
        }
        if (currentGame.playersCapacity ===3) {
            currentGame.GameState.players.splice(2,0,'unassigned');
        }
        if (currentGame.playersCapacity ===4) {
           currentGame.GameState.players.splice(3,0,'unassigned');
        }
        // update number of enrolled players
        currentGame.playersEnrolled--;

        req.xGame = currentGame;
        req.xStatus = 200;
        req.xSendMessage = 'player removed from game successfully';

        next();
    }



}


function addUserToGame(req, res, next) {
    req.xData = JSON.parse(req.body);
    let currentGame = gameList.find((game) => {
        return game.name === req.xData.game.name;
    });
    debugger;
    if (currentGame.isActive) {
        req.xStatus = 403;
        req.xSendMessage = 'Game has already started! cannot enter game';
        next();
    } else {
        let emptyPlayerSeatIndex = currentGame.GameState.players.findIndex((player) => {
            return player === 'unassigned';
        });
        let gameHasSeatAvailable;
        emptyPlayerSeatIndex === -1 ? gameHasSeatAvailable = false : gameHasSeatAvailable = true;
        let nameObject = auth.getUserInfo(req.session.id);
        // if emptyPlayerSeatIndex === -1 it means no empty seats at this game which means this game has
        // already started and we cannot enter a game which is already started.
        if (gameHasSeatAvailable) {
            currentGame.GameState.piles[emptyPlayerSeatIndex + 2].ownerPlayerName = nameObject.name;
            // currentGame.GameState.piles.splice(currentGame.playersEnrolled + 1, 1, (newPlayerPile));
            // TODO : having a problem using PlayerModel constructor here
            currentGame.GameState.players[emptyPlayerSeatIndex] = {
                name: nameObject.name,
                pile: currentGame.GameState.piles[emptyPlayerSeatIndex + 2],
                user: nameObject,
                isBot: false,
                playerStatus: Enums.PlayerStatusEnum.Idle
            }

            currentGame.playersEnrolled++;
            currentGame.playersEnrolled === currentGame.playersCapacity
                ? currentGame.isActive = true
                : currentGame.isActive = false;
            req.xGame = currentGame;
            req.xStatus = 200;
            req.xSendMessage = 'game registered successfully';
        } else {
            req.xStatus = 403;
            req.xSendMessage = 'No available seats in this game';
        }
        emptyPlayerSeatIndex === 0 ? currentGame.GameState.currentPlayer = currentGame.GameState.players[0] : null;

        next();
    }
}

function handleRequestPlayerMove(req, res, next) {
    let currentGame = getGameInfo(req.params.id);
    const cardId = parseInt(req.body);
    let result;
    // check if current message is coming from same user who's the currentPlayer
    if (auth.getUserInfo(req.session.id).name !== currentGame.GameState.currentPlayer.name) {
        return res.status(403).send('play request is forbidden! Not your turn...');
    }

    if (!currentGame.GameState.isGameOver) {
        result = serverGameUtils.playGameMove(currentGame, cardId);
    }
    (result === false)
        ? res.status(403).send('play request is forbidden! move chosen is illegal. try again...')
        : null;
    // if current player is Bot than play its turn/move
    while ((!currentGame.GameState.isGameOver) &&
    (currentGame.GameState.currentPlayer.name === Enums.PlayerEnum.Bot)) {
        let botCardId = serverGameUtils.pickNextBotMove(currentGame);
        result = serverGameUtils.playGameMove(currentGame, botCardId);

        (result === false)
            ? res.status(403).send('play request is forbidden! move chosen is illegal. try again...')
            : null;
    }
    let newCurrentGame;
    if (currentGame.GameState.isGameOver) {
        setTimeout(() => {
            currentGame.isActive = false;
            restartGame(currentGame);
            debugger;
            newCurrentGame = getGameInfo(currentGame.id);
            debugger;
            newCurrentGame.restarting =true;
            let gameIndex = initGameList.findIndex((gameName) => {
                return gameName === newCurrentGame.name;});
                gameList[gameIndex].restarting = true;
                debugger;
            }, 4000);

        }
        currentGame.isActive ? req.xGameContent = currentGame : req.xGameContent = newCurrentGame;
        next();
    }

    function handleChangeColorRequest(req, res, next) {
        const gameId = req.params.id;
        const currentGame = getGameInfo(gameId);
        const body = JSON.parse(req.body)
        if (currentGame.GameState.currentPlayer.name !== auth.getUserInfo(req.session.id).name) {
            res.status(403).send('request is forbidden! this is not your turn ');
        }
        let cardId = body.cardId;
        let cardColor = body.cardColor;

        req.xResult = serverGameUtils.changeCardColor(currentGame, cardId, cardColor);
        next();
    }

    function postingChatInfo(req, res, next) {
        const gameId = req.params.id;
        req.xCurrentGame = getGameInfo(gameId);

        const body = JSON.parse(req.body);
        req.xTextBody = body.text;
        const source = body.id;
        if (source === 'user') {
            req.xSourceInfo = auth.getUserInfo(req.session.id);
        } else if (source === 'server') {
            req.xSourceInfo = {name: 'Console'};
        }
        next();
    }

    /*
    function removeGameFromGameList(req, res, next) {
        if (gameList[req.body.gameName] === undefined) {
            res.status(403).send('user does not exist');
        } else {
            delete gameList[req.body.gameName];
            next();
        }
    }
    */
    function removeGame(gameId) {
        let gameFound;

        const index = gameList.findIndex((game) => {
            return game.id === gameId
        });
        index === -1 ? gameFound = false : gameFound = true;
        if (gameFound) {
            const deletedGame = gameList.splice(index, 1)[0];
            return (deletedGame.id === gameId);
        } else
            return false;
    }

    function getGameInfo(gameId) {
        const gameInfoJson = {
            game: gameList.find((game) => {
                return game.id === parseInt(gameId)
            })
        };
        const gameInfo = gameInfoJson.game;
        let hasGameBeenInitialized;
        let gameIndex = initGameList.findIndex((gameName) => {
            return gameName === gameInfo.name;
        });
        if ((gameIndex > -1) && (gameInfo.restarting === false)) {

            hasGameBeenInitialized = true
        } else {
            hasGameBeenInitialized = false;
            if (gameInfo.restarting) {
                gameList[gameIndex].restarting = false;
            }
        }
        if ((!hasGameBeenInitialized) && (gameInfo.GameState.gameStatus === Enums.GameStatusEnum.InitializingGame)) {
            initGameList.push(gameInfo.name);
            debugger;
            /*
                    //put Bot player at the end of the piles array ( it was created in the start of the array)
                    gameInfo.GameState.piles.splice(gameInfo.GameState.piles.length, 0, (gameInfo.GameState.piles.splice(0, 1)[0]));
            */
            // switch all players in the game to status "Playing"
            for (let i = 0; i < gameInfo.playersCapacity; i++) {
                gameInfo.GameState.players[i].playerStatus = Enums.PlayerStatusEnum.Playing;
            }

            serverGameUtils.createCardsInDrawPile(gameInfo.id);
            serverGameUtils.dealCards(gameInfo.id);
            gameInfo.GameState.gameStatus = Enums.GameStatusEnum.Ongoing;


        }
        return gameInfo;
    }

    function getAllGames() {
        const gamesArray = _.cloneDeep(gameList);
        return gamesArray;
    }

    function restartGame(currentGame) {
        debugger;
        let gameIndex = gameList.findIndex((game) => {
            return game.id === currentGame.id;
        });
        gameList[gameIndex] = _.cloneDeep(currentGame.cleanBackup);
        gameList[gameIndex].cleanBackup = _.cloneDeep(currentGame.cleanBackup);
        debugger;
    }

    function createNewGame(newGameInfo) {
        let newGame;
        newGame = {
            id: gameId,
            name: newGameInfo.name,
            owner: newGameInfo.owner,
            playersCapacity: newGameInfo.playersCapacity,
            playersEnrolled: 0,
            isBotEnabled: newGameInfo.isBotEnabled,
            history: [],
            chatContent: [],
            isActive: false,
            winners: [],
            loser: null,
            restarting: false
        };
        gameId++;
        // creating Players Array
        const newGamePlayers = [];
        _.times(newGame.playersCapacity, () => {
            newGamePlayers.push('unassigned');
        });
        _.times((4 - newGame.playersCapacity), () => {
            newGamePlayers.push(null);
        });


        const newGamePiles = [];
        // creating piles Array for DrawPile and DiscardPile
        newGamePiles.push(new PileModel(Enums.PileIdEnum.DrawPile, Enums.PileTypeEnum.DrawPile));
        newGamePiles.push(new PileModel(Enums.PileIdEnum.DiscardPile, Enums.PileTypeEnum.DiscardPile));

        // creating all players initial piles
        for (let i = 0; i < newGame.playersCapacity; i++) {
            newGamePiles.push(new PileModel(i + 2, Enums.PileTypeEnum.PlayerPile, true));
        }

        if (newGame.isBotEnabled === true) {
            newGamePiles[newGame.playersCapacity + 1].ownerPlayerName = Enums.PlayerEnum.Bot;
            // TODO : having a problem using PlayerModel constructor here
            newGamePlayers[newGame.playersCapacity - 1] = {
                name: Enums.PlayerEnum.Bot,
                pile: null,
                user: null,
                isBot: true,
                playerStatus: Enums.PlayerStatusEnum.Idle
            };

            newGame.playersEnrolled++;   // increment the number of enrolled players due to BOT existence
        }

        newGame.GameState = {
            id: 0,
            players: newGamePlayers,
            piles: newGamePiles,
            currentPlayer: null,

            leadingCard: null,
            actionInvoked: null,
            turnNumber: 0, // ?
            movesCounter: 0, //?
            twoPlusCounter: 0,
            consoleMessage: '',
            gameStatus: Enums.GameStatusEnum.AwaitingPlayers,
            gameDirection: Enums.GameDirectionEnum.Clockwise,
            isGameOver: false,
            consoleCounter: 0
        };

        //if there is a Bot, update the correct pile in for the bot player field
        if (newGame.isBotEnabled === true) {
            newGame.GameState.players[newGame.playersCapacity - 1].pile = newGame.GameState.piles[newGame.playersCapacity + 1];
        }

        // creating a backup so we could restart the game
        newGame.cleanBackup = _.cloneDeep(newGame);
        newGame.cleanBackup.restarting = true;
        gameList.push(newGame);
    }


