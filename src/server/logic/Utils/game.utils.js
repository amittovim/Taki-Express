/*
import * as utils from "./model.utils";
import {GameState} from "../state";
import {PileTypeEnum} from "../../app/enums/pile-type.enum";
import {CardActionEnum} from "../../app/enums/card-action-enum";
import * as dealer from "../dealer/dealer";
import {CardColorEnum} from "../../app/enums/card-color.enum";
import {GameStatusEnum} from "../game-status.enum";
import {PlayerEnum} from "../../app/enums/player.enum";
*/
const Enums = require('../../enums-node/enums-node');
const Utils = require('./model.utils');

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

function handleDrawpileRestocking(newGameStateInfo) {
    restockDrawPile();
    newGameStateInfo = {
        ...newGameStateInfo,
        [Enums.PileTypeEnum.DrawPile]: {
            ...GameState.DrawPile
        },
        [Enums.PileTypeEnum.DiscardPile]: {
            ...GameState.DiscardPile
        }
    };
    return newGameStateInfo;
}

function handleActivatingActionState(newGameStateInfo) {
    const currentPlayerPile = getPlayerPile(GameState.currentPlayer);

    // if current activeState is DIFFERENT than TAKI then update activeState
    // value to be the action on our current card
    if (GameState.actionInvoked !== Enums.CardActionEnum.Taki) {
        GameState.actionInvoked = GameState.leadingCard.action;
        newGameStateInfo = {
            ...newGameStateInfo,
            actionInvoked: GameState.selectedCard.action
        };
        // if current activeState IS taki and player has no more cards with same color to put on it
        // update the activeState value to the action of the card of our current card
    } else {
        let matchedCard = getCardInHand(currentPlayerPile, [{color: GameState.leadingCard.color}]);
        if (matchedCard === undefined) {  //if (!availableMoveExist()) {
            GameState.actionInvoked = GameState.selectedCard.action;
            newGameStateInfo = {
                ...newGameStateInfo,
                actionInvoked: GameState.selectedCard.action
            };
        }
    }
    return newGameStateInfo;
}

function handleDisablingActionState(newGameStateInfo) {
    // disable actionInvoked if need be
    if ((GameState.actionInvoked === Enums.CardActionEnum.Plus) ||
        (GameState.actionInvoked === Enums.CardActionEnum.Stop) ||
        (GameState.actionInvoked === Enums.CardActionEnum.ChangeColor) ||
        (GameState.actionInvoked === Enums.CardActionEnum.TwoPlus && GameState.twoPlusCounter === 0)) {
        GameState.actionInvoked = null;
    }
    newGameStateInfo = {
        ...newGameStateInfo,
        actionInvoked: [GameState.actionInvoked]
    };
    return newGameStateInfo;
}

function handleGameStatistics(newGameStateInfo) {
    const currentPlayerPile = getPlayerPile(GameState.currentPlayer);
    // if player has only 1 card left we are updating his singleCardCounter
    if (currentPlayerPile.cards.length === 1) {
        incrementSingleCardCounter(newGameStateInfo);
    }
    return newGameStateInfo;
}

function incrementSingleCardCounter(newGameStateInfo) {
    const currentPlayerPile = getPlayerPile(GameState.currentPlayer);
    const currentPlayerPileName = getPlayerPile(GameState.currentPlayer).name;
    currentPlayerPile.singleCardCounter++;
    newGameStateInfo = {
        ...newGameStateInfo,
        [`${currentPlayerPileName}.singleCardCounter`]:
        currentPlayerPile.singleCardCounter
    };
    return newGameStateInfo;
}

function handleAllActionInvokedCases(newGameStateInfo){
    const currentPlayerType = GameState.currentPlayer;

    // if TWOPLUS card was invoked in the current play-move, increment twoPlusCounter by 2
    if (GameState.actionInvoked === Enums.CardActionEnum.TwoPlus &&
        GameState.leadingCard === GameState.selectedCard &&                  // means that player PUT card on discardPile
        GameState.selectedCard.action === Enums.CardActionEnum.TwoPlus) {   // and didn't GET card from Drawpile
        newGameStateInfo = handleInvokedTwoPlusState(newGameStateInfo);
    }

    // if CHANGE COLOR card was invoked and the current player is BOT, pick a random color for it
    else if (GameState.actionInvoked === Enums.CardActionEnum.ChangeColor && currentPlayerType === Enums.PlayerEnum.Bot) {
        newGameStateInfo = handleInvokedCCStateByBot(newGameStateInfo);
    }

    // if STOP card was invoked switch player twice or none at all and increment turnCounter by 1
    else if ((GameState.leadingCard.action === Enums.CardActionEnum.Stop) && (GameState.actionInvoked === Enums.CardActionEnum.Stop)) {
        newGameStateInfo = handleInvokedStopState(newGameStateInfo);
    }
    // if SuperTaki was invoked change its color to the same color
    // of the card before it and invoke Taki .
    else if (GameState.actionInvoked === Enums.CardActionEnum.SuperTaki) {
        newGameStateInfo = handleInvokedSuperTakiState(newGameStateInfo);
    }
    // Taki card was invoked
    if (GameState.actionInvoked === Enums.CardActionEnum.Taki) {
        newGameStateInfo = handleInvokedTakiState(newGameStateInfo);
    }
    return newGameStateInfo;
}

function handleInvokedTwoPlusState(newGameStateInfo) {
    GameState.twoPlusCounter += 2;
    newGameStateInfo = {
        ...newGameStateInfo,
        twoPlusCounter: GameState.twoPlusCounter
    };
    return newGameStateInfo;
}

function handleExistingTwoPlusState(newGameStateInfo) {
    if (GameState.leadingCard.id !== GameState.selectedCard.id &&
        GameState.twoPlusCounter > 0) {
        GameState.twoPlusCounter--;
    }
    newGameStateInfo = {
        ...newGameStateInfo,
        twoPlusCounter: GameState.twoPlusCounter,
    };
    return newGameStateInfo;
}

function handleInvokedCCStateByBot(newGameStateInfo) {
    if (GameState.leadingCard.id === GameState.selectedCard.id) {
        GameState.leadingCard.color = pickRandomColor();
    }
    newGameStateInfo = {
        ...newGameStateInfo,
        leadingCard: GameState.leadingCard,
    };
    return newGameStateInfo;
}

function handleInvokedStopState(newGameStateInfo) {
    incrementGameTurnNumber();

    newGameStateInfo = {
        ...newGameStateInfo,
        turnNumber: GameState.turnNumber,
    };
    return newGameStateInfo;
}

function handleInvokedSuperTakiState(newGameStateInfo) {
    GameState.leadingCard.color = GameState.DiscardPile.getSecondCardFromTop().color;
    GameState.actionInvoked = CardActionEnum.Taki;

    newGameStateInfo = {
        ...newGameStateInfo,
        leadingCard: GameState.leadingCard,
        actionInvoked: GameState.actionInvoked,
    };

    return newGameStateInfo;
}

function handleInvokedTakiState(newGameStateInfo) {
    let currentPlayerPile = getPlayerPile(GameState.currentPlayer);

    if (!doesPileHaveSameColorCards(currentPlayerPile)) {
        GameState.actionInvoked = null;
    }
    newGameStateInfo = {
        ...newGameStateInfo,
        actionInvoked: GameState.actionInvoked,
    };
    return newGameStateInfo;

}

function doesPileHaveSameColorCards(currentPlayerPile) {
    let foundSameColorCards = false;
    currentPlayerPile.cards.forEach(function (handCard) {
        if (handCard.color === GameState.selectedCard.color)
            foundSameColorCards = true;
    });
    return foundSameColorCards;
}

function restockDrawPile() {
    let wasRestocked;
    let oldSelectedCard = GameState.selectedCard;
    GameState.gameStatus = Enums.GameStatusEnum.RestockingDeckOfCard;
    while (GameState.DiscardPile.cards.length > 1) {
        cleaningCards();
        dealer.moveCard(Enums.PileTypeEnum.DiscardPile, Enums.PileTypeEnum.DrawPile);
        wasRestocked = true;
    }
    if (wasRestocked) {
        Utils.shuffleArray(GameState.DrawPile.cards);
        GameState.selectedCard = oldSelectedCard;
    }
    GameState.gameStatus = Enums.GameStatusEnum.Ongoing;
}

function cleaningCards() {

    GameState.selectedCard = GameState.DiscardPile.cards[0];
    GameState.selectedCard.parentPileType = Enums.PileTypeEnum.DrawPile;

    if ((GameState.selectedCard.action === Enums.CardActionEnum.ChangeColor) ||
        (GameState.selectedCard.action === Enums.CardActionEnum.SuperTaki)) {
        GameState.selectedCard.color = null;
    }
}

function incrementGameMovesCounter() {
    GameState.movesCounter++;
}

function incrementGameTurnNumber() {
    GameState.turnNumber++;
}

module.exports = {
    pullTopOfPile,
    pickRandomColor,
    getCardInHand,
    handleDrawpileRestocking,
    handleActivatingActionState,
    handleDisablingActionState,
    handleGameStatistics,
    incrementSingleCardCounter,
    incrementGameMovesCounter,
    handleAllActionInvokedCases,
    handleExistingTwoPlusState,
    doesPileHaveSameColorCards,
    incrementGameTurnNumber,
}

