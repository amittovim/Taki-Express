class PileModel {
    constructor( id, type, isHand = false, ownerPlayerName = null) {
        this.id= id;
        this.type = type;
        this.cards = [];
        this.isHand = isHand;
        this.ownerPlayerName = ownerPlayerName;
        this.singleCardCounter = 0;
    }

    getTop() {
        return this.cards[this.cards.length - 1];
    }

    getSecondCardFromTop() {
        return (this.cards[this.cards.length - 2]);
    }

    get isPileEmpty() {
        return (this.cards.length === 0);
    }
}

/*export default PileModel;*/
module.exports = PileModel;
