const express = require('express');
const gameManagement = express.Router();
const bodyParser = require('body-parser');
const auth = require('./authentication');
const dbTmp = require('./database');
const gameUtils = require('./gameUtils');

/*
let gameContent = {
    counterValue : 0,
    lastUpdater: null
};
*/

//bodyParser middleware-parse
gameManagement.use(bodyParser.json());
gameManagement.use(bodyParser.urlencoded({extended: false}));

// middleware that is specific to this router
gameManagement.use(function log(req, res, next) {
    console.log(`log: ${req.originalUrl}: ${req.method}`);
    next()
});

// define the home page route
gameManagement.get('/', auth.userAuthentication, (req, res) => {
    res.send('Game Main page');
});

gameManagement.route('/:id')
    .get(auth.userAuthentication, (req, res) => {
        const gameId = req.params.id;
        debugger;
        res.json(dbTmp.getGameInfo(gameId));
    })
    .put(auth.userAuthentication, (req, res) => {
        gameContent.counterValue++;
        gameContent.lastUpdater = auth.getUserInfo(req.session.id).name;
        // res.redirect(303,'/:id');
        res.json(gameContent);
    });
/*
    const gameInfoFrmServer = dbTmp.getGameInfo(gameId);
    translateContent2Client(gameInfoFrmServer,auth.getUserInfo());

    if (dbTmp.gameStateFrmServer.gameStatus === 'GameInit') {
        gameUtils.initDrawPile(gameId);
        gameUtils.initDiscardPile(gameId);
        gameUtils.dealCards(gameId);
    }
    dbTmp.updateLastStateIdRecievedBy(auth.getUserInfo());
    res.json(gameStateFrmServer);
    res.send('Game Main page');
*/




// define the about route
gameManagement.get('/about', function (req, res) {
    res.send('About Game');
});

module.exports = gameManagement;