const express = require('express');
const gameManagement = express.Router();
const bodyParser = require('body-parser');
const auth = require('./authentication');
const dbTmp = require('./database');
const gameUtils = require('./gameUtils');

//bodyParser middleware-parse
gameManagement.use(bodyParser.json());
gameManagement.use(bodyParser.urlencoded({extended: false}));

// middleware that is specific to this router
gameManagement.use(function log(req, res, next) {
    console.log(`log: ${req.originalUrl}`);
    next()
});



// define the home page route
gameManagement.get('/', auth.userAuthentication, (req, res) => {
    res.send('Game Main page');
});

gameManagement.get('/:id', auth.userAuthentication, (req, res) => {
    const gameId = req.params.id;
    const serverState = dbTmp.getGameInfo(gameId);

    if (serverState.gameStatus === 'GameInit') {
        gameUtils.initDrawPile(gameId);
        gameUtils.initDiscardPile(gameId);
        gameUtils.dealCards(gameId);


    }

    dbTmp.updateLastStateIdRecievedBy(auth.getUserInfo());
    res.json(serverState);
    res.send('Game Main page');
});



// define the about route
gameManagement.get('/about', function (req, res) {
    res.send('About Game');
});

module.exports = gameManagement;