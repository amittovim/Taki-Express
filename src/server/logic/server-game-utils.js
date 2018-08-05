// import * as utils from "../../logic/utils/model.utils";
const PileModel = require('../../server/logic/api-models/pile.class');
const CardModel = require('../../server/logic/api-models/card.class');
const Consts = require('../../server/logic/consts');
// const Utils = require('');
const dbTmp = require('../database');
const Enums = require('../../server/enums-node/enums-node');

let cardId = 0;

function createDrawPile(gameId) {
    debugger;
    let currentGame = dbTmp.getAllGames();      // todo: here is the problem!!!!
    currentGame.find((game) => {
        return game.id === gameId;
    });
    currentGame.GameState.DrawPile = new PileModel(Enums.PileTypeEnum.DrawPile);
    createNumberCards(currentGame);
    createActionCards(currentGame);

    // utils.shuffleArray(GameState.DrawPile.cards);
}

function createNumberCards(currentGame) {
    for (const number in Enums.CardNumberEnum) {
        for (let i = 1; i <= 2; i++) {
            for (let color in Enums.CardColorEnum) {
                let card = new CardModel(cardId++, Enums.CardColorEnum[color], Enums.CardNumberEnum[number]);
                if (Consts.VISIBLE_CARDS) {
                    card.isHidden = false;
                }
                currentGame.GameState.DrawPile.cards.push(card);
            }
        }
    }
}

function createActionCards(currentGame) {
    for (const action in CardActionEnum) {
        if ((Enums.CardActionEnum[action] !== Enums.CardActionEnum.ChangeColor) &&
            (Enums.CardActionEnum[action] !== Enums.CardActionEnum.SuperTaki)) {
            for (let i = 1; i <= 2; i++) {
                for (let color in Enums.CardColorEnum) {
                    if (!Consts.VISIBLE_CARDS) {
                        currentGame.GameState.DrawPile.cards.push(new CardModel(cardId++, Enums.CardColorEnum[color], null, Enums.CardActionEnum[action]));
                    } else {
                        currentGame.GameState.DrawPile.cards.push(new CardModel(cardId++, Enums.CardColorEnum[color], null, Enums.CardActionEnum[action], false));
                    }


                }
            }
        } else if (Enums.CardActionEnum[action] === Enums.CardActionEnum.ChangeColor) {
            for (let j = 1; j <= 4; j++) {
                if (!Consts.VISIBLE_CARDS) {
                    currentGame.GameState.DrawPile.cards.push(new CardModel(cardId++, null, null, Enums.CardActionEnum.ChangeColor));
                } else {
                    currentGame.GameState.DrawPile.cards.push(new CardModel(cardId++, null, null, Enums.CardActionEnum.ChangeColor, false));
                }
            }
        } else if (Enums.CardActionEnum[action] === Enums.CardActionEnum.SuperTaki) {
            for (let i = 1; i <= 2; i++) {
                if (!Consts.VISIBLE_CARDS) {
                    currentGame.GameState.DrawPile.cards.push(new CardModel(cardId++, null, null, Enums.CardActionEnum.SuperTaki));
                } else {
                    currentGame.GameState.DrawPile.cards.push(new CardModel(cardId++, null, null, Enums.CardActionEnum.SuperTaki, false));
                }
            }
        }
    }
}

function initDiscardPile(gameId) {

}

function dealCards(gameId) {

}

module.exports = { createDrawPile, initDiscardPile, dealCards}