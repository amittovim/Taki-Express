let gameId = 0;
const gameList = [];
const initGameList = [];     // list of games that started initializing state

module.exports = {
    addGameToGameList,
    getGameInfo,
    getAllGames,
    addUserToGame,
    removeGame
}

const Enums = require('../server/enums-node/enums-node');
const auth = require('./authentication');
const serverGameUtils = require("./server-game-utils");
const _ = require('lodash');

/*
function findGame(req, res, next) {
}
*/

function addGameToGameList(req, res, next) {
    let newGameInfo = JSON.parse(req.body);
    newGameInfo.owner = auth.getUserInfo(req.session.id);

    console.log(newGameInfo);

    const nameAlreadyExists = gameList.some((game) => game.name === newGameInfo.name);
    if (nameAlreadyExists) {
        res.status(403).send('game name already exist');
    } else {
        createNewGame(newGameInfo);
        console.log(gameList);
        next();
    }
}

function addUserToGame(req, res, next) {
    req.xData = JSON.parse(req.body);
    let currentGame = gameList.find((game) => {
        return game.name === req.xData.game.name;
    });
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

            let newPlayerPile = {
                id: emptyPlayerSeatIndex,
                type: Enums.PileTypeEnum.PlayerPile,
                cards: [],
                isHand: true,
                ownerPlayerName: nameObject.name,
                singleCardCounter: 0
            };
            currentGame.GameState.piles.push(newPlayerPile);

            currentGame.GameState.players[emptyPlayerSeatIndex] = {
                isBot: false,
                user: nameObject,
                name: nameObject.name,
                pile: currentGame.GameState.piles[emptyPlayerSeatIndex+1],
                playerStatus: Enums.PlayerStatusEnum.Idle
            };
            currentGame.GameState.players[emptyPlayerSeatIndex].pile.type = `Player${emptyPlayerSeatIndex + 1}Pile`;
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

        if (currentGame.GameState.player1Pile === null) {
            currentGame.GameState.player1Pile = currentGame.GameState.players[emptyPlayerSeatIndex];
        } else if (currentGame.GameState.player2Pile === null) {
            currentGame.GameState.player2Pile = currentGame.GameState.players[emptyPlayerSeatIndex];
        } else if (currentGame.GameState.player3Pile === null) {
            currentGame.GameState.player3Pile = currentGame.GameState.players[emptyPlayerSeatIndex];
        } else if (currentGame.GameState.player4Pile === null) {
            currentGame.GameState.player4Pile = currentGame.GameState.players[emptyPlayerSeatIndex];
        }
        next();
    }
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
function getGameInfo(gameId) {
    const gameInfoJson = {game: gameList[gameId]};
    const gameInfo = gameInfoJson.game;
    let hasGameBeenInitialized;
    let gameIndex = initGameList.findIndex((gameName) => {
        return gameName === gameInfo.name;
    });
    gameIndex > -1 ? hasGameBeenInitialized = true : hasGameBeenInitialized = false;
    if ((!hasGameBeenInitialized) && (gameInfo.GameState.gameStatus === Enums.GameStatusEnum.InitializingGame)) {
        initGameList.push(gameInfo.name);
        //put Bot player at the end of the piles array ( it was created in the start of the array)
        gameInfo.GameState.piles.splice(gameInfo.GameState.piles.length,0,(gameInfo.GameState.piles.splice(0,1)[0]));
        serverGameUtils.createDrawPile(gameInfo.id);
        serverGameUtils.createDiscardPile(gameInfo.id);
        serverGameUtils.dealCards(gameInfo.id);


    }
    return gameInfo;
}

/*
function getAllGameNames() {
    const gameNamesArray = gameList.map(game => game.name);
    console.log(gameNamesArray);
    return gameNamesArray;
}
*/

function getAllGames() {
    const gamesArray = _.cloneDeep(gameList);
    console.log(gamesArray);
    return gamesArray;
}

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

function createNewGame(newGameInfo) {
    let newGame;
    newGame = {
        id: gameId++,
        name: newGameInfo.name,
        owner: newGameInfo.owner,
        playersCapacity: newGameInfo.playersCapacity,
        playersEnrolled: 0,
        isBotEnabled: newGameInfo.isBotEnabled,
        history: [],
        isActive: false
    };
    // creating PLayers Array
    const newGamePlayers = [];
    _.times(newGame.playersCapacity, () => {
        newGamePlayers.push('unassigned');
    });
    _.times((4 - newGame.playersCapacity), () => {
        newGamePlayers.push(null);
    });
    const newGamePiles = [];
    if (newGame.isBotEnabled === true) {
        newGamePiles.push({
            id: (newGame.playersCapacity+1),
            type: Enums.PileTypeEnum.PlayerPile,
            cards: [],
            isHand: true,
            ownerPlayerName: 'Bot',
            singleCardCounter: 0
        });

        newGamePlayers[newGame.playersCapacity - 1] = {
            isBot: true,
            user: null,
            name: Enums.PlayerEnum.Bot,
            pile: {
                type: Enums.PileTypeEnum.PlayerPile,
                cards: [],
                isHand: true,
                ownerName: Enums.PlayerEnum.Bot,
                singleCardCounter: 0
            },
            playerStatus: Enums.PlayerStatusEnum.Idle
        }
        newGamePlayers[newGame.playersCapacity - 1].pile.type = `Player${newGame.playersCapacity}Pile`;

        // define last player in the game as BOT
        newGame.playersEnrolled++;   // increment the number of enrolled players due to BOT existence
    }
    // creating piles Array for DrawPile and DiscardPile

    newGamePiles.push({
        id: 0,
        type: Enums.PileTypeEnum.DrawPile,
        cards: [],
        isHand: false,
        ownerPlayerName: null,
        singleCardCounter: 0
    });
    newGamePiles.push({
        id: 1,
        type: Enums.PileTypeEnum.DiscardPile,
        cards: [],
        isHand: false,
        ownerPlayerName: null,
        singleCardCounter: 0
    });

    newGame.GameState = {
        id: 0,
        players: newGamePlayers,
        piles: newGamePiles,
        currentPlayer: null,
        // DrawPile: null,
        // DiscardPile: null,
        receivingPileOwner: null,
        givingPileOwner: null,

        leadingCard: null,
        actionInvoked: null,
        turnNumber: 0, // ?
        movesCounter: 0, //?
        twoPlusCounter: 0,
        consoleMessage: '',
        gameStatus: Enums.GameStatusEnum.AwaitingPlayers,
        gameDirection: Enums.GameDirection.Clockwise
    };

    gameList.push(newGame);
}


