const usersList = {};

function userAuthentication(req, res, next) {
    if (usersList[req.session.id] === undefined) {
        res.sendStatus(401);
    } else {
        next();
    }
}

function addUserToAuthList(req, res, next) {
    if (usersList[req.session.id] !== undefined) {
        res.status(403).send('user already exist');
    } else {
        usersList[req.session.id] = req.body;
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
    return {name: usersList[id]};
}

function getAllOnlineUserNames() {
    const userNamesArray = [];
    for (const idProperty in usersList) {
        userNamesArray.push(usersList[idProperty]);
    }
    console.log(userNamesArray);
    return userNamesArray;
}

module.exports = {userAuthentication, addUserToAuthList, removeUserFromAuthList, getUserInfo, getAllOnlineUserNames}
