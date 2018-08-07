/*
import {CardActionEnum} from "../app/enums/card-action-enum";
import * as GameService from "../app/game/game.service";
import {GameStatusEnum} from "../logic/game-status.enum";
import {PlayerEnum} from "../app/enums/player.enum";
import {handleCardMove} from "../logic/dealer/dealer";
import {GameState} from "../logic/state";
import {PileTypeEnum} from "../app/enums/pile-type.enum";
import * as Server from "../logic/main";
*/
let gameId = 0;
const gameList = [];
const initGameList = [];     // list of games that started initializing state
const PileModel = require('./logic/api-models/pile.class');
const PlayerModel = require('./logic/api-models/player.class');
const Enums = require('../server/enums-node/enums-node');
const auth = require('./authentication');
const serverGameUtils = require("./server-game-utils");
const _ = require('lodash');

module.exports = {
    addGameToGameList,
    getGameInfo,
    getAllGames,
    addUserToGame,
    removeGame,
    handlePlayRequestFromPlayer,
    handleChangeColorRequest,
}

function addGameToGameList(req, res, next) {
    let newGameInfo = JSON.parse(req.body);
    newGameInfo.owner = auth.getUserInfo(req.session.id);

    console.log(newGameInfo);

    const nameAlreadyExists = gameList.some((game) => game.name === newGameInfo.name);
    if (nameAlreadyExists) {
        res.status(403).send('game name already exist');
    } else {
        createNewGame(newGameInfo);
        console.log(gameList);
        next();
    }
}

function addUserToGame(req, res, next) {
    req.xData = JSON.parse(req.body);
    let currentGame = gameList.find((game) => {
        return game.name === req.xData.game.name;
    });
    if (currentGame.isActive) {
        req.xStatus = 403;
        req.xSendMessage = 'Game has already started! cannot enter game';
        next();
    } else {
        let emptyPlayerSeatIndex = currentGame.GameState.players.findIndex((player) => {
            return player === 'unassigned';
        });
        let gameHasSeatAvailable;
        emptyPlayerSeatIndex === -1 ? gameHasSeatAvailable = false : gameHasSeatAvailable = true;
        let nameObject = auth.getUserInfo(req.session.id);
        // if emptyPlayerSeatIndex === -1 it means no empty seats at this game which means this game has
        // already started and we cannot enter a game which is already started.
        if (gameHasSeatAvailable) {
            let newPlayerPile =
                new PileModel(emptyPlayerSeatIndex + 2, Enums.PileTypeEnum.PlayerPile, true, nameObject.name);
            currentGame.GameState.piles.splice(currentGame.playersEnrolled + 1, 1, (newPlayerPile));
            // TODO : having a problem using PlayerModel constructor here
            currentGame.GameState.players[emptyPlayerSeatIndex] = {
                name: nameObject.name,
                pile: currentGame.GameState.piles[emptyPlayerSeatIndex + 2],
                user: nameObject,
                isBot: false,
                playerStatus: Enums.PlayerStatusEnum.Idle
            }

            currentGame.playersEnrolled++;
            currentGame.playersEnrolled === currentGame.playersCapacity
                ? currentGame.isActive = true
                : currentGame.isActive = false;
            req.xGame = currentGame;
            req.xStatus = 200;
            req.xSendMessage = 'game registered successfully';
        } else {
            req.xStatus = 403;
            req.xSendMessage = 'No available seats in this game';
        }
        emptyPlayerSeatIndex === 0 ? currentGame.GameState.currentPlayer = currentGame.GameState.players[0] : null;

        next();
    }
}

/*
function removeGameFromGameList(req, res, next) {
    if (gameList[req.body.gameName] === undefined) {
        res.status(403).send('user does not exist');
    } else {
        delete gameList[req.body.gameName];
        next();
    }
}
*/
function getGameInfo(gameId) {
    const gameInfoJson = {game: gameList[gameId]};
    const gameInfo = gameInfoJson.game;
    let hasGameBeenInitialized;
    let gameIndex = initGameList.findIndex((gameName) => {
        return gameName === gameInfo.name;
    });
    gameIndex > -1 ? hasGameBeenInitialized = true : hasGameBeenInitialized = false;
    if ((!hasGameBeenInitialized) && (gameInfo.GameState.gameStatus === Enums.GameStatusEnum.InitializingGame)) {
        initGameList.push(gameInfo.name);
        /*
                //put Bot player at the end of the piles array ( it was created in the start of the array)
                gameInfo.GameState.piles.splice(gameInfo.GameState.piles.length, 0, (gameInfo.GameState.piles.splice(0, 1)[0]));
        */
        serverGameUtils.createCardsInDrawPile(gameInfo.id);
        serverGameUtils.dealCards(gameInfo.id);
        debugger;


    }
    return gameInfo;
}

/*
function getAllGameNames() {
    const gameNamesArray = gameList.map(game => game.name);
    console.log(gameNamesArray);
    return gameNamesArray;
}
*/

function getAllGames() {
    const gamesArray = _.cloneDeep(gameList);
    console.log(gamesArray);
    return gamesArray;
}

function removeGame(gameId) {
    let gameFound;

    const index = gameList.findIndex((game) => {
        return game.id === gameId
    });
    index === -1 ? gameFound = false : gameFound = true;
    if (gameFound) {
        const deletedGame = gameList.splice(index, 1)[0];
        return (deletedGame.id === gameId);
    } else
        return false;
}

function createNewGame(newGameInfo) {
    let newGame;
    newGame = {
        id: gameId++,
        name: newGameInfo.name,
        owner: newGameInfo.owner,
        playersCapacity: newGameInfo.playersCapacity,
        playersEnrolled: 0,
        isBotEnabled: newGameInfo.isBotEnabled,
        history: [],
        isActive: false
    };
    // creating Players Array
    const newGamePlayers = [];
    _.times(newGame.playersCapacity, () => {
        newGamePlayers.push('unassigned');
    });
    _.times((4 - newGame.playersCapacity), () => {
        newGamePlayers.push(null);
    });
    const newGamePiles = [];
    if (newGame.isBotEnabled === true) {
        newGamePiles[newGame.playersCapacity + 1] = new PileModel(
            newGame.playersCapacity + 1, Enums.PileTypeEnum.PlayerPile, true, 'Bot');
        // TODO : having a problem using PlayerModel constructor here
        newGamePlayers[newGame.playersCapacity - 1] = {
            name: Enums.PlayerEnum.Bot,
            pile: null,
            user: null,
            isBot: true,
            playerStatus: Enums.PlayerStatusEnum.Idle
        };

        newGame.playersEnrolled++;   // increment the number of enrolled players due to BOT existence
    }
    // creating piles Array for DrawPile and DiscardPile
    newGamePiles.splice(0, 1, new PileModel(Enums.PileIdEnum.DrawPile, Enums.PileTypeEnum.DrawPile));

    newGamePiles.splice(1, 1, new PileModel(Enums.PileIdEnum.DiscardPile, Enums.PileTypeEnum.DiscardPile));
    /*
            ({
            id: 1,
            type: Enums.PileTypeEnum.DiscardPile,
            cards: [],
            isHand: false,
            ownerPlayerName: null,
            singleCardCounter: 0
        }));
    */

    newGame.GameState = {
        id: 0,
        players: newGamePlayers,
        piles: newGamePiles,
        currentPlayer: null,
        // DrawPile: null,
        // DiscardPile: null,
        receivingPileOwner: null,
        givingPileOwner: null,

        leadingCard: null,
        actionInvoked: null,
        turnNumber: 0, // ?
        movesCounter: 0, //?
        twoPlusCounter: 0,
        consoleMessage: '',
        gameStatus: Enums.GameStatusEnum.AwaitingPlayers,
        gameDirection: Enums.GameDirection.Clockwise
    };

    //update the correct pile for the bot player
    newGame.GameState.players[newGame.playersCapacity - 1].pile = newGame.GameState.piles[newGame.playersCapacity + 1];

    gameList.push(newGame);
}


function handlePlayRequestFromPlayer(req, res, next) {
    let currentGame = getGameInfo(req.params.id);
    const cardId = req.body;

    // check if current message is coming from same user who's the currentPlayer
    if (auth.getUserInfo(req.session.id).name !== currentGame.GameState.currentPlayer.name) {
        return res.status(403).send('play request is forbidden! Not your turn...');
    }
    // verify if move is legal
    const isMoveLegal = isPlayerMoveLegal(currentGame, cardId);
    if (!isMoveLegal) {
        return res.status(403).send('play request is forbidden! move chosen is illegal. try again...');
    } else {
        currentGame.GameState.selectedCard = getCardById(cardId);

        // Moving the card
        let stateChange = serverGameUtils.handleCardMove();

        // side effects
        if (currentGame.GameState.gameStatus === GameStatusEnum.Ongoing) {
            stateChange = processGameStep(stateChange);
        }
    }

    next();
}

function getCardById(currentGame, cardId) {
    const GameState = currentGame.GameState;
    const gameCards = GameState.pile[Enums.PileIdEnum.DrawPile].cards
        .concat(GameState.pile[Enums.PileIdEnum.DiscardPile].cards,
            GameState.pile[Enums.PileIdEnum.Two].cards,
            GameState.pile[Enums.PileIdEnum.Three].cards);
    if (GameState.pile[Enums.PileIdEnum.Four] !== null) {
        gameCards.concat(GameState.pile[Enums.PileIdEnum.Four].cards);
    }
    if (GameState.pile[Enums.PileIdEnum.Five] !== null) {
        gameCards.concat(GameState.pile[Enums.PileIdEnum.Five].cards);
    }
    return gameCards.filter((card) => card.id === cardId)[0];
}

function handleChangeColorRequest(req, res, next){
    const gameId = req.params.id;
    const currentGame = getGameInfo(gameId);
    if (currentGame.GameState.currentPlayer.name !== auth.getUserInfo(req.session.id).name) {
        res.status(403).send('request is forbidden! this is not your turn ');
    }
    let cardId = req.body.cardId;
    let cardColor = req.body.cardColor;

    req.xResult = changeCardColor(currentGame, cardId, cardColor);

    next();
}

function changeCardColor(currentGame, cardId, cardColor){
    let card = getCardById(currentGame, cardId);
    if (card.action === Enums.CardActionEnum.ChangeColor || card.action === Enums.CardActionEnum.SuperTaki) {
        card.color = cardColor;
        return true;
    } else
        return false;
}

function isPlayerMoveLegal(currentGame, cardId ) {
    let card = getCardById(cardId);
    let isWithdrawingCard = (card.parentPileId === Enums.PileIdEnum.DrawPile);

    // check move legality if player want to PUT a card on discard pile
    if (!isWithdrawingCard) {
        return isPutCardMoveLegal(currentGame, card);
    } else {
        // // check move legality if player want to GET (withdrawal) a card from draw pile
        return isGetCardMoveLegal(currentGame);
    }
}

function isPutCardMoveLegal(currentGame, card) {
    let actionInvoked = currentGame.GameState.actionInvoked;
    let leadingCard = currentGame.GameState.leadingCard;
    let isSameColor;

    // if twoPlus is invoked only other twoPlus card is legal
    if (actionInvoked === Enums.CardActionEnum.TwoPlus) {
        if (card.action !== Enums.CardActionEnum.TwoPlus) {
            return false;
        }
    } // if taki is invoked only cards with the same color are legal
    else if (actionInvoked === Enums.CardActionEnum.Taki) {
        isSameColor = (card.color && leadingCard.color === card.color);
        if (!isSameColor) {
            return false;
        }
    } else {
        isSameColor = (card.color && leadingCard.color === card.color);
        let isSameNumber = (card.number && leadingCard.number === card.number);
        let isSameAction = (card.action && leadingCard.action === card.action);
        let isUnColoredActionCard = (card.action && !card.color);
        if (!(isSameColor || isSameNumber || isSameAction || isUnColoredActionCard)) {
            return false;
        }
    }
    return true;
}

function isGetCardMoveLegal(currentGame) {
    let currentPlayerPile = currentGame.GameState.currentPlayer.pile;
    let drawPile = currentGame.GameState.piles[Enums.PileIdEnum.DrawPile];
    let actionInvoked = currentGame.GameState.actionInvoked;
    let leadingCard = currentGame.GameState.leadingCard;

    // checking if withdrawing Card From DrawPile is a legal move - only if drawPile is not empty and no
    // other move is available for player
    if ((!drawPile.isPileEmpty) &&
        (actionInvoked === CardActionEnum.TwoPlus ||
            !availableMoveExist(currentGame, currentPlayerPile, actionInvoked, leadingCard))) {
        return true;
    } else
        return false;
}

function availableMoveExist(currentGame, currentPlayerPile) {
    let legalCards = [];
    currentPlayerPile.cards.forEach(function (card, index) {
        if (isPutCardMoveLegal(currentGame, card)) {
            legalCards.push(index);
        }
    });
    return (legalCards.length > 0);
}
