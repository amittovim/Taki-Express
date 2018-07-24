const auth = require('./authentication');
let gameId = 0;
const gameList = [];
const _ = require('lodash');

/*
function findGame(req, res, next) {
}
*/

function addGameToGameList(req, res, next) {
    let newGame = JSON.parse(req.body);
    console.log(newGame);

    const nameAlreadyExists = gameList.some((game) => game.name === newGame.name);
    if (nameAlreadyExists) {
        res.status(403).send('game name already exist');
    } else {
        newGame.owner = auth.getUserInfo(req.session.id);
        newGame.players = [];
        _.times(newGame.numOfExpectedPlayers, () => { newGame.players.push('unassigned');} );
        _.times( (4-newGame.numOfExpectedPlayers), () => { newGame.players.push(null);} );
        if (newGame.botPlayerEnabled === true) {
            //newGame.players[numOfExpectedPlayers-1] // define last player in the game as BOT
            newGame.numOfEnlistedPlayers++;        // increment the number og enlisted players
        } else {
            newGame.numOfEnlistedPlayers = 0;
        }
        newGame.currentState = {};
        newGame.stateHistory = [];
        newGame.gameStatus = 'AwaitingPlayers';
        newGame.player1 = 'unassigned';
        newGame.player2 = 'BOT';
        newGame.player3 = null;
        newGame.player4 = null;
        newGame.hasStarted = false;
        newGame.id = gameId++;
        newGame.StateId = 0;
        gameList.push(newGame);
        console.log(gameList);
        next();
    }
}

function addUserToGame(req, res, next) {
    req.xData = JSON.parse(req.body);
    console.log(req.xData);

    let currentGame = gameList.find( (game) => { return game.name === req.xData.game.name;} ) ;
    let emptyPlayerSeat = currentGame.players.find( (player) => { return player === 'unassigned';})
    if (emptyPlayerSeat === 'unassigned' ) {
        currentGame.players[emptyPlayerSeat] = auth.getUserInfo().name;
        currentGame.numOfEnlistedPlayers++;
        // res.game = currentGame;
        res.status(200).send('game registered successfully');
    } else {
        res.status(403).send('No available seats in this game');
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

    const index = gameList.findIndex( (game) => { return game.id === gameId } ) ;
    index === -1 ? gameFound = false : gameFound = true ;
    if (gameFound) {
        const deletedGame = gameList.splice(index , 1)[0];
        return (deletedGame.id === gameId);
    } else
        return false;
}

module.exports = {addGameToGameList, getAllGames, addUserToGame, removeGame}
