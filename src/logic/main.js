// import {GameState} from "./state";
// import {PlayerEnum} from "../app/enums/player.enum";
// import {CardActionEnum} from "../app/enums/card-action-enum";
// import {handleCardMove} from "./dealer/dealer";
// import * as GameUtils from "./utils/game.utils";
// import {GameStatusEnum} from "../client/app/enums/game-status.enum";
// import * as dealer from "./dealer/dealer";
// import initDrawPile from "./init/draw-pile.init";
// import initDiscardPile from "./init/discard-pile.init";
// import initPlayers from "./init/players.init";
// import {saveGameState} from "./history/state-history";
// import {getPlayerPile} from "./utils/game.utils";
// import {deepCopy} from "./utils/model.utils";
//
// ///// Inner
// export function initGame() {
//     clearGameState();
//     GameState.gameStatus = GameStatusEnum.GameInit;
//     initPlayers();
//     initGameState();
//     initDrawPile();
//     initDiscardPile();
//     dealer.dealCards();
//     saveGameState();
//     GameState.gameStatus = GameStatusEnum.Ongoing;
//     return GameState;
// }
//
// export function clearGameState() {
//     for (let key in GameState) {
//         GameState[key] = null;
//     }
// }
//
// function initGameState() {
//     GameState.movesCounter = 0;
//     GameState.turnNumber =0;
//     GameState.twoPlusCounter = 0;
//     GameState.consoleMessage = '';
//     GameState.isGameOver=false;
// }
//
// // Bot Player algorithm to choose next move
// export function pickNextBotMove() {
//     GameState.currentPlayer = PlayerEnum.Bot;
//     let leadingCard = GameState.leadingCard;
//     let selectedCard;
//     let actionInvoked = GameState.actionInvoked;
//     let botPile = GameState.BotPile;
//     let matchedCard;
//     // 4.1 if actionInvoked is twoPlusInvoked and bot has twoPlus Card - mark it as selectedCard.
//     if (actionInvoked === CardActionEnum.TwoPlus) {
//         if (matchedCard = GameUtils.getCardInHand(botPile, [{action: CardActionEnum.TwoPlus}])) {
//             selectedCard = matchedCard;
//
//         } // if twoPlusInvoked and bot doesn't have a two plus - mark the top card of the draw pile as the selectedCard.
//         else {
//             selectedCard = GameState.piles[Enums.PileIdEnum.DrawPile].getTop();
//         }
//     } // if actionInvoked is takiInvoked and bot has a card with the same color of the leadingCard - mark it as selectedCard.
//     else if ((actionInvoked === `${CardActionEnum.Taki}Invoked`) &&
//         (matchedCard = GameUtils.getCardInHand(botPile, [{color: leadingCard.color}]))) {
//         selectedCard = matchedCard;
//     } // ( if we got here no actionInvoked was invoked)
//     else {
//         // 4.2 if bot has a twoPlus card  with the same color as the leadingCard
//         // or the leadingCard is a non-active twoPlus - mark it as selectedCard.
//         if ((matchedCard = GameUtils.getCardInHand(botPile, [{action: CardActionEnum.TwoPlus}, {color: leadingCard.color}])) ||
//             ((leadingCard.action === CardActionEnum.TwoPlus) && (matchedCard = GameUtils.getCardInHand(botPile, [{action: CardActionEnum.TwoPlus}])))) {
//             selectedCard = matchedCard;
//         }
//         // 4.3 if bot has ChangeColor card and you're allowed to put it (actionInvoked is none)- mark it as selectedCard.
//         else if (matchedCard = GameUtils.getCardInHand(botPile, [{action: CardActionEnum.ChangeColor}])) {
//             selectedCard = matchedCard;
//         }
//         // 4.4 if bot has  a Stop card with the same color as the leadingCard - mark it as selectedCard.
//         else if (matchedCard = GameUtils.getCardInHand(botPile, [{action: CardActionEnum.Stop}, {color: leadingCard.color}])) {
//             selectedCard = matchedCard;
//         }
//         // 4.5 if bot has a Plus card with the same color as the leadingCard - mark it as selectedCard.
//         else if (matchedCard = GameUtils.getCardInHand(botPile, [{action: CardActionEnum.Plus}, {color: leadingCard.color}])) {
//             selectedCard = matchedCard;
//         }
//         // 4.6 if bot has a superTaki card - mark it as selectedCard.
//         else if (matchedCard = GameUtils.getCardInHand(botPile, [{action: CardActionEnum.SuperTaki}])) {
//             selectedCard = matchedCard;
//         }
//         // 4.7 if bot has a taki card with the same color as the leadingCard - mark it as the selectedCard.
//         else if (matchedCard = GameUtils.getCardInHand(botPile, [{action: CardActionEnum.Taki}, {color: leadingCard.color}])) {
//             selectedCard = matchedCard;
//         }
//         // 4.7.1 if bot has a card with the same action as the leading card - mark it as the selectedCard.
//         else if ((leadingCard.action !== null) &&
//             (matchedCard = GameUtils.getCardInHand(botPile, [{action: leadingCard.action}]))) {
//             selectedCard = matchedCard;
//         }
//         // 4.8 if you have a card with the same color as the leading card - mark it as the selectedCard.
//         else if ((leadingCard.color !== null) &&
//             (matchedCard = GameUtils.getCardInHand(botPile, [{color: leadingCard.color}]))) {
//             selectedCard = matchedCard;
//         }
//         // 4.9 if you have a card with the same number as the leading card - mark it as the selectedCard.
//         else if ((leadingCard.number !== null) &&
//             (matchedCard = GameUtils.getCardInHand(botPile, [{number: leadingCard.number}]))) {
//             selectedCard = matchedCard;
//         }
//         // 4.10 if none of the conditions above happen - mark the top card of the draw pile as the selectedCard.
//         else {
//             selectedCard = GameState.piles[Enums.PileIdEnum.DrawPile].getTop();
//         }
//     }
//     return (selectedCard.id);
// }
//
// export function playHumanMove(cardId) {
//     GameState.currentPlayer = PlayerEnum.Human;
//     return playGameMove(cardId);
// }
//
// export function playGameMove(cardId) {
//     GameState.selectedCard = getCardById(cardId);
//
//     // Moving the card
//     let stateChange = handleCardMove();
//
//     // side effects
//     if (GameState.gameStatus === GameStatusEnum.Ongoing) {
//         stateChange = processGameStep(stateChange);
//     }
//     return stateChange;
// }
//
//
// function getCardById(cardId) {
//     const gameCards = GameState.HumanPile.cards
//         .concat(GameState.BotPile.cards)
//         .concat(GameState.DiscardPile.cards)
//         .concat(GameState.DrawPile.cards);
//     return gameCards.filter((card) => card.id === cardId)[0];
// }
//
// export function switchPlayers() {
//     GameState.currentPlayer = GameState.currentPlayer === PlayerEnum.Bot ? PlayerEnum.Human : PlayerEnum.Bot;
// }
//
// function processGameStep(stateChange) {
//     let newGameStateInfo = {};
//
//     // if drawPile is empty restock it with cards from discardPile
//     if (GameState.piles[Enums.PileIdEnum.DrawPile].isPileEmpty) {
//         newGameStateInfo = GameUtils.handleDrawpileRestocking(newGameStateInfo);
//     }
//
//     // updating statistics
//     newGameStateInfo = GameUtils.handleGameStatistics(newGameStateInfo);
//
//     // check occasions when we need to activate game activeState (if we PUT an action card on discard-pile)
//     if ((GameState.leadingCard.action !== null) &&
//         (GameState.leadingCard === GameState.selectedCard)) {
//         newGameStateInfo = GameUtils.handleActivatingActionState(newGameStateInfo);
//     }
//
//     // in case some action state was invoked , act accordingly
//     newGameStateInfo = GameUtils.handleAllActionInvokedCases(newGameStateInfo);
//
//     // // Checking if game ended
//     GameState.isGameOver = isGameOver();
//
//
//     // store last move to be sent to frontend
//     // todo: decide which is the best option to transfer this state to the frontEnd. here or after changing the next player
//     // i beleive there should be two parts to send here show this information prt one with just a player movement and second
//     // with the next turn player state
//     // option 1:
//     // movesInArray.push(deepCopy(GameState));
//     // option 2:
//     stateChange = deepCopy(GameState);
//
//     // Save current state in history
//     saveGameState();
//
//     //    handleSwitchPlayers(newGameStateInfo);
//     const shouldSwitchPlayer=handleShouldSwitchPlayers();
//
//     //
//     newGameStateInfo = GameUtils.handleDisablingActionState(newGameStateInfo);
//
//     //+++++++++++++++   Import : This is the point where one game move has ended +++++++++++++++++++++++++++
//     //in charge of switching turns
//     handleSwitchPlayer(shouldSwitchPlayer);
//
//     //+++++++++++++++   Import : here we are either in a new game turn or in a new game move +++++++++++++++++++++++++++
//
//
//     return {
//         ...stateChange,
// //        ...newGameStateInfo,
// //        leadingCard: GameState.leadingCard,
// //        isGameOver: GameState.isGameOver,
//         currentPlayer: GameState.currentPlayer,
//         actionInvoked  : GameState.actionInvoked,
//         turnNumber   : GameState.turnNumber
//     };
// }
//
//
// function handleSwitchPlayer(shouldSwitchPlayer) {
//     if (shouldSwitchPlayer) {
//         switchPlayers();
//         GameUtils.incrementGameTurnNumber();
//     }
// }
//
// export function isPutCardMoveLegal(card, actionInvoked, leadingCard) {
//     let isSameColor;
//
//     // if twoPlus is invoked only other twoPlus card is legal
//     if (actionInvoked === CardActionEnum.TwoPlus) {
//         if (card.action !== CardActionEnum.TwoPlus) {
//             return false;
//         }
//     } // if taki is invoked only cards with the same color are legal
//     else if (actionInvoked === CardActionEnum.Taki) {
//         isSameColor = (card.color && leadingCard.color === card.color);
//         if (!isSameColor) {
//             return false;
//         }
//     } else {
//         isSameColor = (card.color && leadingCard.color === card.color);
//         let isSameNumber = (card.number && leadingCard.number === card.number);
//         let isSameAction = (card.action && leadingCard.action === card.action);
//         let isUnColoredActionCard = (card.action && !card.color);
//         if (!(isSameColor || isSameNumber || isSameAction || isUnColoredActionCard)) {
//             return false;
//         }
//     }
//     return true;
// }
//
// export function isGetCardMoveLegal(currentPlayerPile, drawPile, actionInvoked, leadingCard) {
//     // checking if withdrawing Card From DrawPile is a legal move - only if drawPile is not empty and no
//     // other move is available for player
//     if ((!drawPile.isPileEmpty) &&
//         (GameState.actionInvoked === CardActionEnum.TwoPlus ||
//             !availableMoveExist(currentPlayerPile, actionInvoked, leadingCard))) {
//         return true;
//     } else
//         return false;
// }
//
// export function availableMoveExist(currentPlayerPile, actionInvoked, leadingCard) {
//     let legalCards = [];
//     currentPlayerPile.cards.forEach(function (card, index) {
//         if (isPutCardMoveLegal(card, actionInvoked, leadingCard)) {
//             legalCards.push(index);
//         }
//     });
//     return (legalCards.length > 0);
// }
