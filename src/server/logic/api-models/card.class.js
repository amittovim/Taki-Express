/*import {PileTypeEnum} from "../enums/pile-type.enum";*/
const Enums = require('../../enums-node/enums-node')

class CardModel {
    constructor(id, color, number = null, action = null, isHidden = true, parentPileType = Enums.PileTypeEnum.DrawPile) {
        this.id = id;
        this.color = color;
        this.number = number;
        this.action = action;
        this.isHidden = isHidden;
        this.parentPileType = parentPileType;
    }

    get display() {
        let colorDisplay = '';
        if (this.color) {
            colorDisplay += this.color;
        }
        return `${colorDisplay} ${this.action ? this.action : this.number}`;
    }

    get isActionCard() {
        return !!this.action;
    }
}

module.exports = CardModel;

