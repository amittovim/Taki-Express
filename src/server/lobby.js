const Enums = require('./enums-node/enums-node');
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
    console.log(`log: ${req.originalUrl}`);
    next()
});

// lobbyManagement.use('/games', checkEmptyBody);

// function checkEmptyBody(req, res, next) {
//     debugger;
//     if (!req.body) {
//         return res.sendStatus(400);
//     } else {
//         next();
//     }
// }

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
        const currentGame = req.xGame;
        // check if game playersCapacity === playersEnrolled
        if (currentGame.playersCapacity === currentGame.playersEnrolled) {
            currentGame.gameStatus = Enums.GameStatusEnum.InitializingGame;
        }
        res.status(req.xStatus).send({
            currentGame: req.xGame,     // we might not need to send this here
            sendMessage: req.xSendMessage
        });
    })
    .put(auth.userAuthentication, dbTmp.addUserToGame, (req, res) => {
/*
        res.status(200).send('user does not exist');
        res.sendStatus(200);
*/
    });


lobbyManagement.delete('/games/delete/:id', auth.userAuthentication, (req, res) => {
    const gameDeleted = dbTmp.removeGame(Number(req.params.id));
    if (!gameDeleted) {
        res.status(403).send('error deleting game');
    } else {
        res.json(dbTmp.getAllGames());
    }
});

// define the about route
lobbyManagement.get('/about', function (req, res) {
    res.send('About Lobby');
});

module.exports = lobbyManagement;
