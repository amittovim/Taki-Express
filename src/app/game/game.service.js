import {PileTypeEnum} from "../enums/pile-type.enum";
import * as Server from './../../logic/main'
import {GameState} from "../../logic/state";

export function isHumanMoveLegal(card, drawPile, actionInvoked, leadingCard, humanPile) {
    let isWithdrawingCard = (card.parentPileType === PileTypeEnum.DrawPile);

    // check move legality if player want to PUT a card on discard pile
    if (!isWithdrawingCard) {
        return Server.isPutCardMoveLegal(card, actionInvoked, leadingCard);
    } else {
        // // check move legality if player want to GET (withdrawal) a card from draw pile
        return Server.isGetCardMoveLegal(humanPile, drawPile, actionInvoked, leadingCard);
    }
}

