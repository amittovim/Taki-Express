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
        debugger;
        console.log(gameList);
        next();
    }
}

function addUserToGame(req, res, next) {
    debugger;
    req.xData = JSON.parse(req.body);
    console.log(req.xData);

    let currentGame = gameList.find((game) => {
        return game.name === req.xData.game.name;
    });
    let emptyPlayerSeatIndex = currentGame.gameState.players.findIndex((player) => {
        return player === 'unassigned';
    });
    if (emptyPlayerSeatIndex !== -1) {
        currentGame.players[emptyPlayerSeatIndex] = {
            isBot: false,
            user: auth.getUserInfo(),
            name: auth.getUserInfo().name,
            pile: {
                type: Enums.PileTypeEnum.HumanPile,
                cards: [],
                isHand: true,
                ownerName: auth.getUserInfo().name,
                singleCardCounter: 0
            },
            playerStatus: Enums.PlayerStatusEnum.Idle
        };
        currentGame.playersEnrolled++;
        req.xGame = currentGame;
        req.xStatus = 200;
        req.xSendMessage = 'game registered successfully';
    } else {
        req.xStatus = 403;
        req.xSendMessage = 'No available seats in this game';
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

function getGameInfo(gameName) {
    return {game: gameList[gameName]};
}

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

module.exports = {addGameToGameList, getAllGames, addUserToGame, removeGame}

function createNewGame(newGameInfo) {
    debugger;
    let newGame;
    newGame = {
        id: gameId++,
        name: newGameInfo.name,
        owner: newGameInfo.owner,
        playersCapacity: newGameInfo.playersCapacity,
        playersEnrolled: 0,
        isBotEnabled: newGameInfo.isBotEnabled,
        gameStatus: Enums.GameStatusEnum.AwaitingPlayers,
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
    };
    newGame.gameStatus = 'AwaitingPlayers';

    gameList.push(newGame);
}