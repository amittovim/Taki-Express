const express = require('express');
const lobbyManagement = express.Router();
const bodyParser = require('body-parser');
const auth = require('./authentication');
const dbTmp = require('./database');
const chatContent = [];
/*
//bodyParser middleware
lobbyManagement.use(bodyParser.text());
*/
//bodyParser middleware-parse application/x-www-form-urlencoded
lobbyManagement.use(bodyParser.urlencoded({ extended: false }))
//bodyParser middleware-parse application/json
lobbyManagement.use(bodyParser.json())

// middleware that is specific to this router
lobbyManagement.use(function log (req, res, next) {
    console.log(`log: ${req.originalUrl}`);
    next()
});


// define the home page route
lobbyManagement.route('/')
    .get(auth.userAuthentication, (req, res) => {
        res.json(chatContent);
    })
    .post(auth.userAuthentication, (req, res) => {
        debugger;
        const body = req.body;
        const userInfo =  auth.getUserInfo(req.session.id);
        chatContent.push({user: userInfo, text: body});
        res.sendStatus(200);
    });

lobbyManagement.appendUserLogoutMessage = function(userInfo) {
    chatContent.push({user: userInfo, text: `user had logout`});
};

lobbyManagement.get('/allUsers', auth.userAuthentication, (req, res) => {
    const onlineUsersList = auth.getAllOnlineUserNames();
    res.json(onlineUsersList);
});

lobbyManagement.route('/games')
    //.get(auth.userAuthentication,  function (req, res) {
        // TODO: add here a response that returns all existing games
        // const body = req.body;
        // console.log(body);
        // res.json(auth.usersList);
    //});
    .post( auth.userAuthentication, (req, res) => {
        if (!req.body) return res.sendStatus(400);
        let newGame = JSON.parse(req.body);
        console.log(newGame);
        newGame.owner= auth.getUserInfo(req.session.id);
        newGame.currentState= {};
        newGame.history= [];
        newGame.player1=auth.getUserInfo(req.session.id);
        newGame.player2='BOT';
        newGame.player3= null;
        newGame.player4= null;
        newGame.hasStarted= false;
        // todo : next step - creating a game in gamesList
    });

// define the about route
lobbyManagement.get('/about', function (req, res) {
    res.send('About Lobby');
});

module.exports = lobbyManagement;