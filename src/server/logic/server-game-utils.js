/*
import {CardColorEnum} from "../../app/enums/card-color.enum";
import {PileTypeEnum} from "../../app/enums/pile-type.enum";
import {CardActionEnum} from "../../app/enums/card-action-enum";
import {CardNumberEnum} from "../../app/enums/card-number.enum";
*/
import PileModel from "../../app/api-models/pile.class";
import {CardModel} from "../../app/api-models/card.class";
import {VISIBLE_CARDS} from "../../logic/consts";
import * as utils from "../../logic/utils/model.utils";

const PileModel = require('../../app/api-models/pile.class');
const CardModel = require('../../app/api-models/card.class');
const VISIBLE_CARDS = require('../../logic/consts');

const dbTmp = require('../database');
const Enums = require('../../server/enums-node/enums-node');
let cardId = 0;

function createDrawPile(gameId) {
    let currentGame = dbTmp.gameList.find((game) => {
        return game.id === gameId;
        currentGame.GameState.DrawPile = new PileModel(Enums.PileTypeEnum.DrawPile);
    createNumberCards();
    createActionCards();

    utils.shuffleArray(GameState.DrawPile.cards);
}

function createNumberCards() {
    for (const number in Enums.CardNumberEnum) {
        for (let i = 1; i <= 2; i++) {
            for (let color in Enums.CardColorEnum) {
                let card = new CardModel(cardId++, Enums.CardColorEnum[color], Enums.CardNumberEnum[number]);
                if (VISIBLE_CARDS) {
                    card.isHidden = false;
                }
                GameState.DrawPile.cards.push(card);
            }
        }
    }
}

function createActionCards() {
    for (const action in CardActionEnum) {
        if ((Enums.CardActionEnum[action] !== Enums.CardActionEnum.ChangeColor) &&
            (Enums.CardActionEnum[action] !== Enums.CardActionEnum.SuperTaki)) {
            for (let i = 1; i <= 2; i++) {
                for (let color in Enums.CardColorEnum) {
                    if (!VISIBLE_CARDS) {
                        GameState.DrawPile.cards.push(new CardModel(cardId++, CardColorEnum[color], null, CardActionEnum[action]));
                    } else {
                        GameState.DrawPile.cards.push(new CardModel(cardId++, CardColorEnum[color], null, CardActionEnum[action], false));
                    }


                }
            }
        } else if (CardActionEnum[action] === CardActionEnum.ChangeColor) {
            for (let j = 1; j <= 4; j++) {
                if (!VISIBLE_CARDS) {
                    GameState.DrawPile.cards.push(new CardModel(cardId++, null, null, CardActionEnum.ChangeColor));
                } else {
                    GameState.DrawPile.cards.push(new CardModel(cardId++, null, null, CardActionEnum.ChangeColor, false));
                }
            }
        } else if (CardActionEnum[action] === CardActionEnum.SuperTaki) {
            for (let i = 1; i <= 2; i++) {
                if (!VISIBLE_CARDS) {
                    GameState.DrawPile.cards.push(new CardModel(cardId++, null, null, CardActionEnum.SuperTaki));
                } else {
                    GameState.DrawPile.cards.push(new CardModel(cardId++, null, null, CardActionEnum.SuperTaki, false));
                }
            }
        }
    }
}

function initDiscardPile(gameId) {

}

function dealCards(gameId) {

}

module.exports = {initDrawPile: createDrawPile, initDiscardPile, dealCards}