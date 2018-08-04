const usersList = {};

function userAuthentication(req, res, next) {
    if (usersList[req.session.id] === undefined) {
        res.sendStatus(401);
    } else {
        next();
    }
}

function addUserToAuthList(req, res, next) {
    let user, userExist;
    for (user in usersList) {
        if ( usersList[user].name === req.body) {
            userExist=true;
        }
    }
    if ( userExist) {
        res.status(403).send('user already exist');
    } else {
        usersList[req.session.id] = {
            cookie: req.session.id,
            name: req.body,
            isPlayer: false,
            playerData: null
        };
        next();
    }
}

function removeUserFromAuthList(req, res, next) {
    if (usersList[req.session.id] === undefined) {
        res.status(403).send('user does not exist');
    } else {
        delete usersList[req.session.id];
        next();
    }
}

function getUserInfo(id) {
    return {name: usersList[id].name};
}

function getAllOnlineUserNames() {
    const userNamesArray = [];
    for (const idProperty in usersList) {
        userNamesArray.push(usersList[idProperty].name);
    }
    console.log(userNamesArray);
    return userNamesArray;
}

module.exports = {userAuthentication, addUserToAuthList, removeUserFromAuthList, getUserInfo, getAllOnlineUserNames}
