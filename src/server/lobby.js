const express = require('express');
const lobbyManagement = express.Router();
const bodyParser = require('body-parser');
const auth = require('./authentication');

const chatContent = [];

//bodyParser middleware
lobbyManagement.use(bodyParser.text());

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
    .post(auth.userAuthentication,  function (req, res) {
        const body = req.body;
        console.log(body);
        res.json(auth.usersList);
    });

// define the about route
lobbyManagement.get('/about', function (req, res) {
    res.send('About Lobby');
});

module.exports = lobbyManagement;