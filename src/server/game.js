import initDiscardPile from "../logic/init/discard-pile.init";
import initDrawPile from "../logic/init/draw-pile.init";
import {saveGameState} from "../logic/history/state-history";
import * as dealer from "../logic/dealer/dealer";

const express = require('express');
const gameManagement = express.Router();
const bodyParser = require('body-parser');
const auth = require('./authentication');
const dbTmp = require('./database');
const gameServer = require('./gameServer');

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
        gameServer.initDrawPile(gameId);
        gameServer.initDiscardPile(gameId);
        gameServer.dealCards(gameId);


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