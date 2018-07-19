const gamesList = {}

function findGame(req, res, next) {
}

function addGameToGamesList(req, res, next) {
    if (gamesList[req.body.gameName] !== undefined) {
        res.status(403).send('game name already exist');
    } else {
        gamesList[req.body.gameNAme] = req.body;
        next();
    }
}

function removeGameFromGamesList(req, res, next) {
    if (gamesList[req.body.gameName] === undefined) {
        res.status(403).send('user does not exist');
    } else {
        delete gamesList[req.body.gameName];
        next();
    }
}

function getGameInfo(gameName)  {
    return {game: gamesList[gameName]};
}

function getAllGameNames()  {
    const gameNamesArray  = [];
    for (const gameName in gamesList) {
        gameNamesArray.push(gamesList[gameName].name);
    }
    console.log(gameNamesArray);
    return gameNamesArray;
}

module.exports = {findGame, addGameToGamesList, removeGameFromGamesList, getGameInfo, getAllGameNames}