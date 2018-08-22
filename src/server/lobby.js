const Enums = require('./enums-node');
const express = require('express');
const lobbyManagement = express.Router();
const bodyParser = require('body-parser');
const auth = require('./authentication');
const dbTmp = require('./database');
const chatContent = [];

//bodyParser middleware-parse
lobbyManagement.use(bodyParser.json());
lobbyManagement.use(bodyParser.urlencoded({extended: false}));

// middleware that is specific to this router
lobbyManagement.use(function log(req, res, next) {
    console.log(`log: ${req.originalUrl}: ${req.method}`);
    next()
});

// define the home page route
lobbyManagement.route('/')
    .get(auth.userAuthentication, (req, res) => {
        res.json(chatContent);
    })
    .post(auth.userAuthentication, (req, res) => {
        const body = req.body;
        const userInfo = auth.getUserInfo(req.session.id);
        chatContent.push({user: userInfo, text: body});
        res.sendStatus(200);
    });

lobbyManagement.appendUserLogoutMessage = function (userInfo) {
    chatContent.push({user: userInfo, text: `user had logout`});
};

lobbyManagement.get('/allUsers', auth.userAuthentication, (req, res) => {
    const onlineUsersList = auth.getAllOnlineUserNames();
    res.json(onlineUsersList);
});

lobbyManagement.route('/games')
    .get(auth.userAuthentication, function (req, res) {
        const allGames = dbTmp.getAllGames();
        res.json(allGames);
    })
    .post(auth.userAuthentication, dbTmp.addGameToGameList, (req, res) => {
        res.sendStatus(200);
    })
    .put(auth.userAuthentication, dbTmp.addUserToGame, (req, res) => {
        const currentGame = req.xGame;
        // check if game playersCapacity === playersEnrolled
        if (currentGame.playersCapacity === currentGame.playersEnrolled) {
            currentGame.GameState.gameStatus = Enums.GameStatusEnum.InitializingGame;
        }


        // check if game is ready to start if so,
        // change game status to init and init game
        res.status(req.xStatus).send({
            currentGame: currentGame,     // we might not need to send this here
            sendMessage: req.xSendMessage
        });
    });

lobbyManagement.put('/games/leaving', auth.userAuthentication, dbTmp.removeUserFromGame,  (req, res) => {
    const currentGame = req.xGame;
    res.status(req.xStatus).send({
        currentGame: currentGame,     // we might not need to send this here
        sendMessage: req.xSendMessage
    });
});

lobbyManagement.delete('/games/delete/:id', auth.userAuthentication, (req, res) => {
    const gameDeleted = dbTmp.removeGame(Number(req.params.id));
    if (!gameDeleted) {
        res.status(403).send('error deleting game');
    } else {
        res.json(dbTmp.getAllGames());
    }
});


lobbyManagement.get('/games/restartGame/:id', auth.userAuthentication, dbTmp.requestRestartGame,  (req, res) => {
    debugger;
    res.json(req.xGameContent);
});
// define the about route
lobbyManagement.get('/about', function (req, res) {
    res.send('About Lobby');
});

module.exports = lobbyManagement;
