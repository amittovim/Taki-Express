const dbTmp = require('./database');
const PileModel = require('./logic/api-models/pile.class');
const CardModel = require('./logic/api-models/card.class');
const Consts = require('./logic/consts');
const Utils = require('./logic/Utils/model.utils');
const GameUtils = require('./logic/Utils/game.utils');
const Enums = require('./enums-node/enums-node');
const _ = require('lodash');

let cardId = 0;

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
                if (Consts.VISIBLE_CARDS) {
                    card.isHidden = false;
                }
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
            GameState.selectedCard.isHidden = isCardHidden(Enums.PileIdEnum.DrawPile, GameState.currentPlayer.pile.id);
            updatedPiles = moveCard(GameState, Enums.PileIdEnum.DrawPile, GameState.currentPlayer.pile.id);
            GameState.selectedCard = GameState.piles[Enums.PileIdEnum.DrawPile].getTop();
        }
        GameState.selectedCard = null;
        return updatedPiles;
    }

    // all other cases
    const sourcePileId = GameState.selectedCard.parentPileId;
    const destinationPileId = getDestinationPileId(GameState, sourcePileId);
    GameState.selectedCard.parentPileId = destinationPileId;
    GameState.selectedCard.isHidden = isCardHidden(sourcePileId, destinationPileId);
    updateLeadingCard(GameState, destinationPileId);
    return moveCard(GameState, sourcePileId, destinationPileId);
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
                return name === pile.ownerName;
            });
            return chosenPile.id;
        }
    }
}
// TODO: for Dor:find a way to implement this function correctly - right now it doesnt work right
function isCardHidden(sourcePileId, destinationPileId) {
    if (!Consts.VISIBLE_CARDS) {
        return ((sourcePileId === Enums.PileIdEnum.DrawPile && destinationPileId === Enums.PileIdEnum.Two) ||
            sourcePileId === Enums.PileIdEnum.DiscardPile);
    } else return false;
}
// TODO: Implement this new function to replace old console message
function calculateConsoleMessage(selectedCardDisplay, sourcePileId, destinationPileId) {

}

function moveCard(GameState, sourcePileId, destinationPileId) {
    Utils.pullItemFromArray(GameState.selectedCard, GameState.piles[sourcePileId].cards);
    Utils.insertToEndOfArray(GameState.selectedCard, GameState.piles[destinationPileId].cards);

    if (GameState.gameStatus === Enums.GameStatusEnum.Ongoing) {
        GameUtils.incrementGameMovesCounter();
    }
    // old console message
    GameState.consoleMessage = `${GameState.selectedCard.display} was moved from ${sourcePileId} to ${destinationPileId}`;
    //TODO: replace this with a new calculateConsoleMessage according to task C-3 from trello
    //GameState.consoleMessage = calculateConsoleMessage(GameState.selectedCard.display, sourcePileId, destinationPileId);
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
    let numOfPlayers = currentGame.playersCapacity;
    let currentPlayerIndex = GameState.players.findIndex((player) => {
        return player === GameState.currentPlayer
    });

    if (currentGame.GameState.gameDirection === Enums.GameDirection.Clockwise) {
        currentPlayerIndex++;
        currentPlayerIndex > (numOfPlayers - 1) ? currentPlayerIndex = 0 : null;
    } else {
        currentPlayerIndex--;
        currentPlayerIndex < 0 ? currentPlayerIndex = (numOfPlayers - 1) : null;
    }
    GameState.currentPlayer = GameState.players[currentPlayerIndex];
}


module.exports = {
    createCardsInDrawPile,
    dealCards,
    handleCardMove,
    moveCard,
    getDestinationPileType: getDestinationPileId,
    isCardHidden,
    saveGameState
}