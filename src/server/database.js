const auth = require('./authentication');
let gameId = 0;
const gameList = [];
const _ = require('lodash');
function findGame(req, res, next) {
}

function addGameToGameList(req, res, next) {
    let newGame = JSON.parse(req.body);
    console.log(newGame);

    const nameAlreadyExists = gameList.some((game) => game.name === newGame.name);

    if (nameAlreadyExists) {
        res.status(403).send('game name already exist');
    } else {
        newGame.owner = auth.getUserInfo(req.session.id);
        newGame.numOfExpectedPlayers = 0;
        newGame.currentState = {};
        newGame.history = [];
        newGame.player1 = auth.getUserInfo(req.session.id);
        newGame.player2 = 'BOT';
        newGame.player3 = null;
        newGame.player4 = null;
        newGame.hasStarted = false;
        newGame.id = gameId++;
        gameList.push(newGame);
        console.log(gameList);
        next();
    }
}

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

function getAllGames() {
    const gamesArray = _.cloneDeep(gameList);
    console.log(gamesArray);
    return gamesArray;
}

module.exports = {findGame, addGameToGameList, removeGameFromGameList, getGameInfo, getAllGameNames, getAllGames}
