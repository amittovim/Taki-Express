const Enums = require('../server/enums-node/enums-node');
const auth = require('./authentication');
let gameId = 0;
const gameList = [];
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
        let emptyPlayerSeatIndex = currentGame.gameState.players.findIndex((player) => {
            return player === 'unassigned';
        });
        let gameHasSeatAvailable;
        emptyPlayerSeatIndex === -1 ? gameHasSeatAvailable = false: gameHasSeatAvailable = true;
        let nameObject = auth.getUserInfo(req.session.id);
        // if emptyPlayerSeatIndex === -1 it means no empty seats at this game which means this game has
        // already started and we cannot enter a game which is already started.
        if (gameHasSeatAvailable) {
            currentGame.gameState.players[emptyPlayerSeatIndex] = {
                isBot: false,
                user: nameObject,
                name: nameObject.name,
                pile: {
                    type: Enums.PileTypeEnum.HumanPile,
                    cards: [],
                    isHand: true,
                    ownerName: nameObject.name,
                    singleCardCounter: 0
                },
                playerStatus: Enums.PlayerStatusEnum.Idle
            };
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
    return gameInfoJson.game;
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

module.exports = {addGameToGameList, getGameInfo, getAllGames, addUserToGame, removeGame}

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

    const newGamePlayers = [];
    _.times(newGame.playersCapacity, () => {
        newGamePlayers.push('unassigned');
    });
    _.times((4 - newGame.playersCapacity), () => {
        newGamePlayers.push(null);
    });
    if (newGame.isBotEnabled === true) {
        newGamePlayers[newGame.playersCapacity - 1] = {
            isBot: true,
            user: null,
            name: Enums.PlayerEnum.Bot,
            pile: {
                type: Enums.PileTypeEnum.BotPile,
                cards: [],
                isHand: true,
                ownerName: Enums.PlayerEnum.Bot,
                singleCardCounter: 0
            },
            playerStatus: Enums.PlayerStatusEnum.Idle
        }
        // define last player in the game as BOT
        newGame.playersEnrolled++;   // increment the number of enrolled players due to BOT existence
    }
    newGame.gameState = {
        id: 0,
        players: newGamePlayers,
        currentPlayer: null,
        drawPile: null,
        discardPile: null,
        receivingPileOwner: null,
        givingPileOwner: null,

        leadingCard: null,
        actionInvoked: null,
        turnNumber: 0, // ?
        movesCounter: 0, //?
        twoPlusCounter: 0,
        consoleMessage: '',
        gameStatus: Enums.GameStatusEnum.AwaitingPlayers
    };

    gameList.push(newGame);
}