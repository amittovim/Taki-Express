const dbTmp = require('./database');
const PileModel = require('./logic/api-models/pile.class');
const CardModel = require('./logic/api-models/card.class');
const Consts = require('./logic/consts');
const Utils = require('./logic/Utils/model.utils');
const Enums = require('./enums-node');
const _ = require('lodash');


let cardId = 0;

module.exports = {
    createCardsInDrawPile,
    dealCards,
    handleCardMove,
    moveCard,
    getDestinationPileId,
    saveGameState,
    processGameStep,
    playGameMove,
    pickNextBotMove,
    getCardById,
    changeCardColor,
    isPlayerMoveLegal,
    isPutCardMoveLegal,
    isGetCardMoveLegal,
    availableMoveExist,
    pullTopOfPile,
    pickRandomColor,
    getCardInHand,
    handleActivatingActionState,
    handleDisablingActionInvoked,
    handleGameStatistics,
    incrementSingleCardCounter,
    incrementGameMovesCounter,
    handleAllActionInvokedCases,
    handleExistingTwoPlusState,
    doesPileHaveSameColorCards,
    incrementGameTurnNumber,
}

function createCardsInDrawPile(gameId) {
    let currentGame = dbTmp.getGameInfo(gameId);
    createNumberCards(currentGame);
    createActionCards(currentGame);

    Utils.shuffleArray(currentGame.GameState.piles[Enums.PileIdEnum.DrawPile].cards);
}

function createNumberCards(currentGame) {
    for (const number in Enums.CardNumberEnum) {
        for (let i = 1; i <= 2; i++) {
            for (let color in Enums.CardColorEnum) {
                let card = new CardModel(cardId++, Enums.CardColorEnum[color], Enums.CardNumberEnum[number]);
                currentGame.GameState.piles[Enums.PileIdEnum.DrawPile].cards.push(card);
            }
        }
    }
}

function createActionCards(currentGame) {
    for (const action in Enums.CardActionEnum) {
        if ((Enums.CardActionEnum[action] !== Enums.CardActionEnum.ChangeColor) &&
            (Enums.CardActionEnum[action] !== Enums.CardActionEnum.SuperTaki)) {
            for (let i = 1; i <= 2; i++) {
                for (let color in Enums.CardColorEnum) {
                    if (!Consts.VISIBLE_CARDS) {
                        currentGame.GameState.piles[Enums.PileIdEnum.DrawPile].cards.push(new CardModel(cardId++, Enums.CardColorEnum[color], null, Enums.CardActionEnum[action]));
                    } else {
                        currentGame.GameState.piles[Enums.PileIdEnum.DrawPile].cards.push(new CardModel(cardId++, Enums.CardColorEnum[color], null, Enums.CardActionEnum[action], false));
                    }
                }
            }
        } else if (Enums.CardActionEnum[action] === Enums.CardActionEnum.ChangeColor) {
            for (let j = 1; j <= 4; j++) {
                if (!Consts.VISIBLE_CARDS) {
                    currentGame.GameState.piles[Enums.PileIdEnum.DrawPile].cards.push(new CardModel(cardId++, null, null, Enums.CardActionEnum.ChangeColor));
                } else {
                    currentGame.GameState.piles[Enums.PileIdEnum.DrawPile].cards.push(new CardModel(cardId++, null, null, Enums.CardActionEnum.ChangeColor, false));
                }
            }
        } else if (Enums.CardActionEnum[action] === Enums.CardActionEnum.SuperTaki) {
            for (let i = 1; i <= 2; i++) {
                if (!Consts.VISIBLE_CARDS) {
                    currentGame.GameState.piles[Enums.PileIdEnum.DrawPile].cards.push(new CardModel(cardId++, null, null, Enums.CardActionEnum.SuperTaki));
                } else {
                    currentGame.GameState.piles[Enums.PileIdEnum.DrawPile].cards.push(new CardModel(cardId++, null, null, Enums.CardActionEnum.SuperTaki, false));
                }
            }
        }
    }
}

function dealCards(gameId) {
    let currentGame = dbTmp.getGameInfo(gameId);
    dealHands(currentGame);
    drawStartingCard(currentGame);
}

function dealHands(currentGame) {
    _.times(Consts.NUMBER_OF_STARTING_CARDS_IN_PLAYERS_HAND, () => {
        _.times(currentGame.playersCapacity, () => {
            handleCardMove(currentGame);
            saveGameState(currentGame.id);
            switchPlayers(currentGame);
        });
    });
}

function drawStartingCard(currentGame) {
    currentGame.GameState.gameStatus = Enums.GameStatusEnum.SettingStartingCard;
    do {
        // It draws another card if the card drawn is change-color because you cannot start a taki with this card
        handleCardMove(currentGame);
        saveGameState(currentGame.id);

    } while (currentGame.GameState.selectedCard.action &&
    (currentGame.GameState.selectedCard.action === Enums.CardActionEnum.ChangeColor ||
        currentGame.GameState.selectedCard.action === Enums.CardActionEnum.SuperTaki));
}

function handleCardMove(currentGame) {
    const GameState = currentGame.GameState;
    // in case we are in gameStatus "InitializingGame" or "SettingStartingCard" than our
    // source pile card is the draw-pile top card
    if (GameState.gameStatus === Enums.GameStatusEnum.InitializingGame ||
        GameState.gameStatus === Enums.GameStatusEnum.SettingStartingCard) {
        GameState.selectedCard = GameState.piles[Enums.PileIdEnum.DrawPile].getTop();
    }

    // in case twoPlus action state is enabled and we don't have a two plus card
    if ((GameState.actionInvoked === Enums.CardActionEnum.TwoPlus) &&
        (GameState.selectedCard === GameState.piles[Enums.PileIdEnum.DrawPile].getTop())) {
        let updatedPiles;
        for (GameState.twoPlusCounter; GameState.twoPlusCounter > 0; GameState.twoPlusCounter--) {
            GameState.selectedCard.parentPileId = GameState.currentPlayer.pile.id;
            updatedPiles = moveCard(GameState, Enums.PileIdEnum.DrawPile, GameState.currentPlayer.pile.id);
            GameState.selectedCard = GameState.piles[Enums.PileIdEnum.DrawPile].getTop();
        }
        GameState.selectedCard = null;
        return updatedPiles;       // TODO : currently no one is receiving this return object. could cancel the return here
    }

    // all other cases
    const sourcePileId = GameState.selectedCard.parentPileId;
    const destinationPileId = getDestinationPileId(GameState, sourcePileId);
    GameState.selectedCard.parentPileId = destinationPileId;
    updateLeadingCard(GameState, destinationPileId);
    return moveCard(GameState, sourcePileId, destinationPileId); // TODO : currently no one is receiving this return object. could cancel the return here
}

function saveGameState(gameId) {
    let currentGame = dbTmp.getGameInfo(gameId);
    currentGame.GameState.id++;
    currentGame.history.push(_.cloneDeep(currentGame.GameState));
}

// TODO: need to test this function . not sure we'll need it at all
// can identify players' names or NONPlayers types such as drawPile and discardPile
function getPileId(GameStatus, name) {
    switch (name) {
        case Enums.PileTypeEnum.DrawPile: {
            return 0;
        }
        case Enums.PileTypeEnum.DiscardPile: {
            return 1;
        }
        default: {
            let chosenPile = GameState.piles.find((pile) => {
                return name === pile.ownerPlayerName;
            });
            return chosenPile.id;
        }
    }
}

function calculateConsoleMessage(GameState, sourcePileId, destinationPileId) {
    let playerName;
    let message = `#${GameState.consoleCounter} | Turn ${GameState.turnNumber}:`;   //TODO: add here <Game-Time> : <Game-TurnNo> : <GameMoveNo> to the beginning of console message
    GameState.consoleCounter++;
    if (GameState.gameStatus === Enums.GameStatusEnum.InitializingGame ||
        GameState.gameStatus === Enums.GameStatusEnum.SettingStartingCard) {
        playerName = 'Dealer';
        if (GameState.piles[destinationPileId].isHand === true) {
            message = `${message} ${playerName} gave a card to one of the players from Draw-Pile`;
        } else if (destinationPileId === Enums.PileIdEnum.DiscardPile) {
            message = `${message} ${playerName} STARTED Discard-Pile with ${GameState.selectedCard.display} as leading card`;
        }
    } else if (GameState.gameStatus === Enums.GameStatusEnum.Ongoing) {
        playerName = GameState.currentPlayer.name;
        if (GameState.piles[destinationPileId].isHand === true) {
            message = `${message} ${playerName} took a card from draw pile`;
        } else if (destinationPileId === Enums.PileIdEnum.DiscardPile) {
            message = `${message} ${playerName} PUT ${GameState.selectedCard.display} on ${GameState.piles[1].getSecondCardFromTop().display} `;
        }
    }
    return message;
}

function moveCard(GameState, sourcePileId, destinationPileId) {
    Utils.pullItemFromArray(GameState.selectedCard, GameState.piles[sourcePileId].cards);
    Utils.insertToEndOfArray(GameState.selectedCard, GameState.piles[destinationPileId].cards);

    if (GameState.gameStatus === Enums.GameStatusEnum.Ongoing) {
        incrementGameMovesCounter(GameState);
    }
    // old console message
    //GameState.consoleMessage = `${GameState.selectedCard.display} was moved from ${sourcePileId} to ${destinationPileId}`;
    GameState.consoleMessage = calculateConsoleMessage(GameState, sourcePileId, destinationPileId);
    console.log(GameState.consoleMessage);
    return {
        ['piles']: {
            ...GameState.piles
        }
    };
}


function updateLeadingCard(GameState, destinationPileId) {
    if (destinationPileId === Enums.PileIdEnum.DiscardPile) {
        GameState.leadingCard = GameState.selectedCard;
    }
}

function getDestinationPileId(GameState, sourcePileId) {
    switch (sourcePileId) {
        case Enums.PileIdEnum.DrawPile: {
            if (GameState.gameStatus === Enums.GameStatusEnum.SettingStartingCard) {
                return Enums.PileIdEnum.DiscardPile;
            } else {
                return GameState.currentPlayer.pile.id;
            }
        }
        case Enums.PileIdEnum.DiscardPile:
            return Enums.PileIdEnum.DrawPile;
        case Enums.PileIdEnum.Two:
        case Enums.PileIdEnum.Three:
        case Enums.PileIdEnum.Four:
        case Enums.PileIdEnum.Five:
            return Enums.PileIdEnum.DiscardPile;
        default:
            break;
    }
}

// TODO: not sure i need this function.  not sure its working either!
function getDestinationPileOwner(GameState, sourcePileOwner) {
    switch (sourcePileType) {
        case Enums.PileTypeEnum.DrawPile: {
            if (GameState.gameStatus === Enums.GameStatusEnum.SettingStartingCard) {
                return Enums.PileTypeEnum.DiscardPile;
            } else {
                return GameState.currentPlayer === Enums.PlayerEnum.Human ? Enums.PileTypeEnum.HumanPile : Enums.PileTypeEnum.BotPile;
            }
        }
        case Enums.PileTypeEnum.DiscardPile:
            return Enums.PileTypeEnum.DrawPile;
        case Enums.PileTypeEnum.PlayerPile:
            return Enums.PileTypeEnum.DiscardPile;
        default:
            break;
    }
}

function switchPlayers(currentGame) {
    const GameState = currentGame.GameState;
    do {
        switchPlayersHelper(currentGame);
    } while (GameState.currentPlayer.playerStatus !== Enums.PlayerStatusEnum.Playing)
}

function switchPlayersHelper(currentGame) {
    const GameState = currentGame.GameState;
    let numOfPlayers = currentGame.playersCapacity;
    let currentPlayerIndex = GameState.players.findIndex((player) => {
        return player === GameState.currentPlayer
    });

    if (currentGame.GameState.gameDirection === Enums.GameDirectionEnum.Clockwise) {
        currentPlayerIndex++;
        currentPlayerIndex > (numOfPlayers - 1) ? currentPlayerIndex = 0 : null;
    } else {
        currentPlayerIndex--;
        currentPlayerIndex < 0 ? currentPlayerIndex = (numOfPlayers - 1) : null;
    }
    GameState.currentPlayer = GameState.players[currentPlayerIndex];
}


function processGameStep(currentGame) {
    const GameState = currentGame.GameState;
    // if drawPile is empty restock it with cards from discardPile
    if (GameState.piles[Enums.PileIdEnum.DrawPile].isPileEmpty) {
        restockDrawPile(currentGame);
    }

    // updating statistics
    handleGameStatistics(currentGame);

    // check occasions when we need to activate game actionInvoked (if we PUT an action card on discard-pile)
    if ((GameState.leadingCard.action !== null) &&
        (GameState.leadingCard === GameState.selectedCard)) {
        handleActivatingActionState(currentGame);
    }

    // in case some action state was invoked , act accordingly
    handleAllActionInvokedCases(currentGame);

    // Checking if current player won
    if (hasPlayerWon(currentGame)) {
        //todo : make a nice modal for players that this player won
        GameState.currentPlayer.playerStatus = Enums.PlayerStatusEnum.FinishedPlaying;
        currentGame.winners.push(GameState.currentPlayer);

    }

    // Checking if game ended
    if (currentGame.winners.length === currentGame.playersCapacity - 1) {
        currentGame.loser = GameState.players.find((player) => {
            return player.playerStatus === Enums.PlayerStatusEnum.Playing
        })
        //todo : make a nice modal for players that this player LOST
        GameState.isGameOver = true;

    }

    // Save current state in history
    saveGameState(currentGame.id);

    if (GameState.isGameOver) {
        currentGame.isActive = false;
        return;
    }
    //  handleSwitchPlayers(newGameStateInfo);
    const shouldSwitchPlayer = handleShouldSwitchPlayers(currentGame);

    //
    handleDisablingActionInvoked(currentGame);

    //+++++++++++++++   Important : This is the point where one game move has ended +++++++++++++++++++++++++++
    //in charge of switching turns
    handleSwitchPlayer(currentGame, shouldSwitchPlayer);
    //+++++++++++++++   Important : here we are either in a new game turn or in a new game move +++++++++++++++++++++++++++

}

function hasPlayerWon(currentGame) {
    const GameState = currentGame.GameState;
    const currentPlayersPile = GameState.currentPlayer.pile;
    if (GameState.actionInvoked !== Enums.CardActionEnum.Plus) {
        return currentPlayersPile.cards.length === 0;
    }
}

function playGameMove(currentGame, cardId) {
    // verify if move is legal
    const isMoveLegal = isPlayerMoveLegal(currentGame, cardId);
    if (!isMoveLegal) {
        return false;
    } else {
        currentGame.GameState.selectedCard = getCardById(currentGame, cardId);

        // Moving the card
        handleCardMove(currentGame);

        // side effects
        if (currentGame.GameState.gameStatus === Enums.GameStatusEnum.Ongoing) {
            processGameStep(currentGame);
        }

        /*
                    // if game is active continue. if game isn't active anymore, restart the game
                    if (currentGame.isActive) {
                        return true;
                    } else {
                        //dbTmp.restartGame(currentGame);
                    }
        */
        return true;
    }
}

// Bot Player algorithm to choose next move
function pickNextBotMove(currentGame) {
    const GameState = currentGame.GameState;

    // GameState.currentPlayer = Enums.PlayerEnum.Bot;
    let leadingCard = GameState.leadingCard;
    let selectedCard;
    let actionInvoked = GameState.actionInvoked;
    let botPile = GameState.currentPlayer.pile;
    let matchedCard;
    // 4.1 if actionInvoked is twoPlusInvoked and bot has twoPlus Card - mark it as selectedCard.
    if (actionInvoked === Enums.CardActionEnum.TwoPlus) {
        if (matchedCard = getCardInHand(botPile, [{action: Enums.CardActionEnum.TwoPlus}])) {
            selectedCard = matchedCard;

        } // if twoPlusInvoked and bot doesn't have a two plus - mark the top card of the draw pile as the selectedCard.
        else {
            selectedCard = GameState.piles[Enums.PileIdEnum.DrawPile].getTop();
        }
    } // if actionInvoked is takiInvoked and bot has a card with the same color of the leadingCard - mark it as selectedCard.
    else if ((actionInvoked === `${Enums.CardActionEnum.Taki}Invoked`) &&
        (matchedCard = getCardInHand(botPile, [{color: leadingCard.color}]))) {
        selectedCard = matchedCard;
    } // ( if we got here no actionInvoked was invoked)
    else {
        // 4.2 if bot has a twoPlus card  with the same color as the leadingCard
        // or the leadingCard is a non-active twoPlus - mark it as selectedCard.
        if ((matchedCard = getCardInHand(botPile, [{action: Enums.CardActionEnum.TwoPlus}, {color: leadingCard.color}])) ||
            ((leadingCard.action === Enums.CardActionEnum.TwoPlus) && (matchedCard = getCardInHand(botPile, [{action: Enums.CardActionEnum.TwoPlus}])))) {
            selectedCard = matchedCard;
        }
        // 4.3 if bot has ChangeColor card and you're allowed to put it (actionInvoked is none)- mark it as selectedCard.
        else if (matchedCard = getCardInHand(botPile, [{action: Enums.CardActionEnum.ChangeColor}])) {
            selectedCard = matchedCard;
        }
        // 4.4 if bot has  a Stop card with the same color as the leadingCard - mark it as selectedCard.
        else if (matchedCard = getCardInHand(botPile, [{action: Enums.CardActionEnum.Stop}, {color: leadingCard.color}])) {
            selectedCard = matchedCard;
        }
        // 4.5 if bot has a Plus card with the same color as the leadingCard - mark it as selectedCard.
        else if (matchedCard = getCardInHand(botPile, [{action: Enums.CardActionEnum.Plus}, {color: leadingCard.color}])) {
            selectedCard = matchedCard;
        }
        // 4.6 if bot has a superTaki card - mark it as selectedCard.
        else if (matchedCard = getCardInHand(botPile, [{action: Enums.CardActionEnum.SuperTaki}])) {
            selectedCard = matchedCard;
        }
        // 4.7 if bot has a taki card with the same color as the leadingCard - mark it as the selectedCard.
        else if (matchedCard = getCardInHand(botPile, [{action: Enums.CardActionEnum.Taki}, {color: leadingCard.color}])) {
            selectedCard = matchedCard;
        }
        // 4.7.1 if bot has a card with the same action as the leading card - mark it as the selectedCard.
        else if ((leadingCard.action !== null) &&
            (matchedCard = getCardInHand(botPile, [{action: leadingCard.action}]))) {
            selectedCard = matchedCard;
        }
        // 4.8 if you have a card with the same color as the leading card - mark it as the selectedCard.
        else if ((leadingCard.color !== null) &&
            (matchedCard = getCardInHand(botPile, [{color: leadingCard.color}]))) {
            selectedCard = matchedCard;
        }
        // 4.9 if you have a card with the same number as the leading card - mark it as the selectedCard.
        else if ((leadingCard.number !== null) &&
            (matchedCard = getCardInHand(botPile, [{number: leadingCard.number}]))) {
            selectedCard = matchedCard;
        }
        // 4.10 if none of the conditions above happen - mark the top card of the draw pile as the selectedCard.
        else {
            selectedCard = GameState.piles[Enums.PileIdEnum.DrawPile].getTop();
        }
    }
    return (selectedCard.id);
}

function getCardById(currentGame, cardId) {
    const GameState = currentGame.GameState;
    let gameCards = GameState.piles[Enums.PileIdEnum.DrawPile].cards
        .concat(GameState.piles[Enums.PileIdEnum.DiscardPile].cards,
            GameState.piles[Enums.PileIdEnum.Two].cards,
            GameState.piles[Enums.PileIdEnum.Three].cards);
    if (GameState.piles[Enums.PileIdEnum.Four] !== undefined) {
        gameCards = gameCards.concat(GameState.piles[Enums.PileIdEnum.Four].cards);
    }
    if (GameState.piles[Enums.PileIdEnum.Five] !== undefined) {
        gameCards = gameCards.concat(GameState.piles[Enums.PileIdEnum.Five].cards);
    }
    return gameCards.filter((card) => {
        return card.id === cardId
    })[0];
}

function changeCardColor(currentGame, cardId, cardColor) {
    let card = getCardById(currentGame, cardId);
    if (card.action === Enums.CardActionEnum.ChangeColor || card.action === Enums.CardActionEnum.SuperTaki) {
        card.color = cardColor;
        return true;
    } else
        return false;
}

function isPlayerMoveLegal(currentGame, cardId) {
    if (Consts.ALL_MOVES_LEGAL) {
        return true;
    } else {
        let card = getCardById(currentGame, cardId);
        let isWithdrawingCard = (card.parentPileId === Enums.PileIdEnum.DrawPile);

        // check move legality if player want to PUT a card on discard pile
        if (!isWithdrawingCard) {
            return isPutCardMoveLegal(currentGame, card);
        } else {
            // // check move legality if player want to GET (withdrawal) a card from draw pile
            return isGetCardMoveLegal(currentGame);
        }
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
        isSameColor = (card.color && leadingCard.color === card.color) ||
            (card.action === Enums.CardActionEnum.ChangeColor);
        let isSameNumber = (card.number && leadingCard.number === card.number);
        let isSameAction = ((card.action && leadingCard.action === card.action) ||
            (card.action && leadingCard.action === Enums.CardActionEnum.SuperTaki && card.action === Enums.CardActionEnum.Taki));
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
        (actionInvoked === Enums.CardActionEnum.TwoPlus ||
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

function restockDrawPile(currentGame) {
    const GameState = currentGame.GameState;
    let wasRestocked;
    let oldSelectedCard = GameState.selectedCard;
    GameState.gameStatus = Enums.GameStatusEnum.RestockingDeckOfCard;
    while (GameState.piles[Enums.PileIdEnum.DiscardPile].cards.length > 1) {
        cleaningCards(currentGame);
        moveCard(GameState, Enums.PileIdEnum.DiscardPile, Enums.PileIdEnum.DrawPile);
        wasRestocked = true;
    }
    if (wasRestocked) {
        Utils.shuffleArray(GameState.piles[Enums.PileIdEnum.DrawPile].cards);
        GameState.selectedCard = oldSelectedCard;
    }
    GameState.gameStatus = Enums.GameStatusEnum.Ongoing;
}

function cleaningCards(currentGame) {
    const GameState = currentGame.GameState;

    GameState.selectedCard = GameState.piles[Enums.PileIdEnum.DiscardPile].cards[0];
    GameState.selectedCard.parentPileId = Enums.PileIdEnum.DrawPile;

    if ((GameState.selectedCard.action === Enums.CardActionEnum.ChangeColor) ||
        (GameState.selectedCard.action === Enums.CardActionEnum.SuperTaki)) {
        GameState.selectedCard.color = null;
    }
}

function pullTopOfPile(pile) {
    return Utils.pullItemFromEndOfArray(pile.cards);
}

function pickRandomColor() {
    let randomInt = Utils.getRandomInt(0, 3);
    let color = Utils.getKey(Enums.CardColorEnum, randomInt);
    return Enums.CardColorEnum[color];
}

function getCardInHand(pile, conditionList) {
    return Utils.getFirstItemByMatchConditions(pile.cards, conditionList);
}

function handleActivatingActionState(currentGame) {
    const GameState = currentGame.GameState;
    const currentPlayerPile = GameState.currentPlayer.pile;

    // if current activeState is DIFFERENT than TAKI then update activeState
    // value to be the action on our current card
    if (GameState.actionInvoked !== Enums.CardActionEnum.Taki) {
        GameState.actionInvoked = GameState.leadingCard.action;

        // if current activeState IS taki and player has no more cards with same color to put on it
        // update the activeState value to the action of the card of our current card
    } else {
        let matchedCard = getCardInHand(currentPlayerPile, [{color: GameState.leadingCard.color}]);
        if (matchedCard === undefined) {  //if (!availableMoveExist()) {
            GameState.actionInvoked = GameState.selectedCard.action;
        }
    }
}

function handleDisablingActionInvoked(currentGame) {
    const GameState = currentGame.GameState;
    // disable actionInvoked if need be
    if ((GameState.actionInvoked === Enums.CardActionEnum.Plus) ||
        (GameState.actionInvoked === Enums.CardActionEnum.Stop) ||
        (GameState.actionInvoked === Enums.CardActionEnum.ChangeDirection) ||
        (GameState.actionInvoked === Enums.CardActionEnum.ChangeColor) ||
        (GameState.actionInvoked === Enums.CardActionEnum.TwoPlus && GameState.twoPlusCounter === 0)) {
        GameState.actionInvoked = null;
    }
}

function handleGameStatistics(currentGame) {
    const GameState = currentGame.GameState;
    const currentPlayerPile = GameState.currentPlayer.pile;
    // if player has only 1 card left we are updating his singleCardCounter
    if (currentPlayerPile.cards.length === 1) {
        incrementSingleCardCounter(currentGame);
    }
}

function incrementSingleCardCounter(currentGame) {
    const GameState = currentGame.GameState;
    GameState.currentPlayer.pile.singleCardCounter++;
}

function handleAllActionInvokedCases(currentGame) {
    const GameState = currentGame.GameState;

    // if TWOPLUS card was invoked in the current play-move, increment twoPlusCounter by 2
    if (GameState.actionInvoked === Enums.CardActionEnum.TwoPlus &&
        GameState.leadingCard === GameState.selectedCard &&                  // means that player PUT card on discardPile
        GameState.selectedCard.action === Enums.CardActionEnum.TwoPlus) {   // and didn't GET card from Drawpile
        handleInvokedTwoPlusState(currentGame);
    }

    // if CHANGE DIRECTION card was invoked change game direction
    else if (GameState.actionInvoked === Enums.CardActionEnum.ChangeDirection) {
        handleInvokedChangeDirection(currentGame);
    }

    // if CHANGE COLOR card was invoked and the current player is BOT, pick a random color for it
    else if (GameState.actionInvoked === Enums.CardActionEnum.ChangeColor &&
        GameState.currentPlayer.name === Enums.PlayerEnum.Bot) {
        handleInvokedCCStateByBot(currentGame);
    }

    // if STOP card was invoked switch player twice or none at all and increment turnCounter by 1
    else if ((GameState.leadingCard.action === Enums.CardActionEnum.Stop) && (GameState.actionInvoked === Enums.CardActionEnum.Stop)) {
        handleInvokedStopState(currentGame);
    }
    // if SuperTaki was invoked change its color to the same color
    // of the card before it and invoke Taki .
    else if (GameState.actionInvoked === Enums.CardActionEnum.SuperTaki) {
        handleInvokedSuperTakiState(currentGame);
    }
    // Taki card was invoked
    if (GameState.actionInvoked === Enums.CardActionEnum.Taki) {
        handleInvokedTakiState(currentGame);
    }
}

function handleInvokedChangeDirection(currentGame) {
    const GameState = currentGame.GameState;
    GameState.gameDirection === Enums.GameDirectionEnum.Clockwise
        ? GameState.gameDirection = Enums.GameDirectionEnum.CounterClockwise
        : GameState.gameDirection = Enums.GameDirectionEnum.Clockwise
}

function handleInvokedTwoPlusState(currentGame) {
    const GameState = currentGame.GameState;
    GameState.twoPlusCounter += 2;
}

function handleExistingTwoPlusState(currentGame) {
    const GameState = currentGame.GameState;
    if (GameState.leadingCard.id !== GameState.selectedCard.id &&
        GameState.twoPlusCounter > 0) {
        GameState.twoPlusCounter--;
    }
}

function handleInvokedCCStateByBot(currentGame) {
    const GameState = currentGame.GameState;
    if (GameState.leadingCard.id === GameState.selectedCard.id) {
        GameState.leadingCard.color = pickRandomColor();
    }
}

function handleInvokedStopState(currentGame) {
    incrementGameTurnNumber(currentGame);
}

function handleInvokedSuperTakiState(currentGame) {
    const GameState = currentGame.GameState;
    GameState.leadingCard.color = GameState.piles[Enums.PileIdEnum.DiscardPile].getSecondCardFromTop().color;
    GameState.actionInvoked = Enums.CardActionEnum.Taki;

}

function handleInvokedTakiState(currentGame) {
    const GameState = currentGame.GameState;
    let currentPlayerPile = GameState.currentPlayer.pile;

    if (!doesPileHaveSameColorCards(currentGame, currentPlayerPile)) {
        GameState.actionInvoked = null;
    }
}

function doesPileHaveSameColorCards(currentGame, currentPlayerPile) {
    const GameState = currentGame.GameState;
    let foundSameColorCards = false;

    currentPlayerPile.cards.forEach(function (handCard) {
        if (handCard.color === GameState.selectedCard.color)
            foundSameColorCards = true;
    });
    return foundSameColorCards;
}

function incrementGameMovesCounter(GameState) {
    GameState.movesCounter++;
}

function incrementGameTurnNumber(currentGame) {
    const GameState = currentGame.GameState;
    GameState.turnNumber++;
}

function handleShouldSwitchPlayers(currentGame) {
    const GameState = currentGame.GameState;
    let shouldSwitchPlayers = true;
    let currentPlayerPile = GameState.currentPlayer.pile;
    // if current player status different than "playing" we should switch players (like maybe he just won)
    if (GameState.currentPlayer.playerStatus !== Enums.PlayerStatusEnum.Playing)
        return true;

    // we check all cases when we shouldn't switch player
    if  //if someone just put a PLUS card
    (((GameState.actionInvoked === GameState.leadingCard.action) && (GameState.leadingCard.action === Enums.CardActionEnum.Plus))
        //if someone just put a STOP card
        || ((GameState.actionInvoked === GameState.leadingCard.action) && (GameState.leadingCard.action === Enums.CardActionEnum.Stop))
        //if someone is taking cards from pile due to a TWOPLUS card he received before it
        || ((GameState.twoPlusCounter !== 0) && (GameState.leadingCard.id !== GameState.selectedCard.id))
        //if someone just put a TAKI or SUPERTAKI and he has more cards with the same color
        || (((GameState.actionInvoked === Enums.CardActionEnum.Taki) || (GameState.actionInvoked === Enums.CardActionEnum.SuperTaki))
            && (doesPileHaveSameColorCards(currentGame, currentPlayerPile)))) {
        shouldSwitchPlayers = false;
    }
    return shouldSwitchPlayers;
}

function handleSwitchPlayer(currentGame, shouldSwitchPlayer) {
    if (shouldSwitchPlayer) {
        switchPlayers(currentGame);
        incrementGameTurnNumber(currentGame);
    }
}
