const express = require('express');
const gameManagement = express.Router();
const bodyParser = require('body-parser');
const auth = require('./authentication');
const dbTmp = require('./database');

//bodyParser middleware-parse
gameManagement.use(bodyParser.json());
gameManagement.use(bodyParser.urlencoded({extended: false}));

// middleware that is specific to this router
gameManagement.use(function log(req, res, next) {
    console.log(`log: ${req.originalUrl}: ${req.method}`);
    next()
});


gameManagement.route('/:id')
    .get(auth.userAuthentication, (req, res) => {
        debugger;
        const gameId = req.params.id;
        res.json(dbTmp.getGameInfo(gameId));
    })
    .put(auth.userAuthentication,
        dbTmp.handleRequestPlayerMove, (req, res) => {
            res.json(req.xGameContent)
        });

/*
    const gameInfoFrmServer = dbTmp.getGameInfo(gameId);
    translateContent2Client(gameInfoFrmServer,auth.getUserInfo());

    }
    dbTmp.updateLastStateIdRecievedBy(auth.getUserInfo());
    res.json(gameStateFrmServer);
    res.send('Game Main page');
*/

// define the about route
gameManagement.put('/changeColor/:id', auth.userAuthentication,
    dbTmp.handleChangeColorRequest, (req, res) => {
        ((req.xResult))
            ? res.status(200).send('color changed successfully')
            : res.status(403).send('request is forbidden! card color is unchangable ');
    });

// define the home page route
gameManagement.get('/', auth.userAuthentication, (req, res) => {
    res.send('Game Main page');
});

// define the about route
gameManagement.get('/about', function (req, res) {
    res.send('About Game');
});

module.exports = gameManagement;
