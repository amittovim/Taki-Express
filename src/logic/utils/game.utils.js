import * as utils from "./model.utils";
import {GameState} from "../state";
import {PileTypeEnum} from "../../app/enums/pile-type.enum";
import {CardActionEnum} from "../../app/enums/card-action-enum";
import * as dealer from "../dealer/dealer";
import {CardColorEnum} from "../../app/enums/card-color.enum";
import {GameStatusEnum} from "../../client/app/enums/game-status.enum";
import {PlayerEnum} from "../../app/enums/player.enum";

export function pullTopOfPile(pile) {
    return utils.pullItemFromEndOfArray(pile.cards);
}

export function pickRandomColor() {
    let randomInt = utils.getRandomInt(0, 3);
    let color = utils.getKey(CardColorEnum, randomInt);
    return CardColorEnum[color];
}

export function getCardInHand(pile, conditionList) {
    return utils.getFirstItemByMatchConditions(pile.cards, conditionList);
}

export function handleDrawpileRestocking(newGameStateInfo) {
    restockDrawPile();
    newGameStateInfo = {
        ...newGameStateInfo,
        [PileTypeEnum.DrawPile]: {
            ...GameState.DrawPile
        },
        [PileTypeEnum.DiscardPile]: {
            ...GameState.DiscardPile
        }
    };
    return newGameStateInfo;
}

export function handleActivatingActionState(newGameStateInfo) {
    const currentPlayerPile = getPlayerPile(GameState.currentPlayer);

    // if current activeState is DIFFERENT than TAKI then update activeState
    // value to be the action on our current card
    if (GameState.actionInvoked !== CardActionEnum.Taki) {
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

export function handleDisablingActionState(newGameStateInfo) {
    // disable actionInvoked if need be
    if ((GameState.actionInvoked === CardActionEnum.Plus) ||
        (GameState.actionInvoked === CardActionEnum.Stop) ||
        (GameState.actionInvoked === CardActionEnum.ChangeColor) ||
        (GameState.actionInvoked === CardActionEnum.TwoPlus && GameState.twoPlusCounter === 0)) {
        GameState.actionInvoked = null;
    }
    newGameStateInfo = {
        ...newGameStateInfo,
        actionInvoked: [GameState.actionInvoked]
    };
    return newGameStateInfo;
}

export function handleGameStatistics(newGameStateInfo) {
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

export function handleAllActionInvokedCases(newGameStateInfo){
    const currentPlayerType = GameState.currentPlayer;

    // if TWOPLUS card was invoked in the current play-move, increment twoPlusCounter by 2
    if (GameState.actionInvoked === CardActionEnum.TwoPlus &&
        GameState.leadingCard === GameState.selectedCard &&                  // means that player PUT card on discardPile
        GameState.selectedCard.action === CardActionEnum.TwoPlus) {   // and didn't GET card from Drawpile
        newGameStateInfo = handleInvokedTwoPlusState(newGameStateInfo);
    }

    // if CHANGE COLOR card was invoked and the current player is BOT, pick a random color for it
    else if (GameState.actionInvoked === CardActionEnum.ChangeColor && currentPlayerType === PlayerEnum.Bot) {
        newGameStateInfo = handleInvokedCCStateByBot(newGameStateInfo);
    }

    // if STOP card was invoked switch player twice or none at all and increment turnCounter by 1
    else if ((GameState.leadingCard.action === CardActionEnum.Stop) && (GameState.actionInvoked === CardActionEnum.Stop)) {
        newGameStateInfo = handleInvokedStopState(newGameStateInfo);
    }
    // if SuperTaki was invoked change its color to the same color
    // of the card before it and invoke Taki .
    else if (GameState.actionInvoked === CardActionEnum.SuperTaki) {
        newGameStateInfo = handleInvokedSuperTakiState(newGameStateInfo);
    }
    // Taki card was invoked
    if (GameState.actionInvoked === CardActionEnum.Taki) {
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

export function handleExistingTwoPlusState(newGameStateInfo) {
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

export function doesPileHaveSameColorCards(currentPlayerPile) {
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
    GameState.gameStatus = GameStatusEnum.RestockingDeckOfCard;
    while (GameState.DiscardPile.cards.length > 1) {
        cleaningCards();
        dealer.moveCard(PileTypeEnum.DiscardPile, PileTypeEnum.DrawPile);
        wasRestocked = true;
    }
    if (wasRestocked) {
        utils.shuffleArray(GameState.DrawPile.cards);
        GameState.selectedCard = oldSelectedCard;
    }
    GameState.gameStatus = GameStatusEnum.Ongoing;
}

function cleaningCards() {

    GameState.selectedCard = GameState.DiscardPile.cards[0];
    GameState.selectedCard.parentPileType = PileTypeEnum.DrawPile;

    if ((GameState.selectedCard.action === CardActionEnum.ChangeColor) ||
        (GameState.selectedCard.action === CardActionEnum.SuperTaki)) {
        GameState.selectedCard.color = null;
    }
}


export function incrementGameMovesCounter() {
    GameState.movesCounter++;
}

export function incrementGameTurnNumber() {
    GameState.turnNumber++;
}
