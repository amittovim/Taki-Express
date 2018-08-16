const Enums = require('../../enums-node');


class PlayerModel {
    constructor(name, pile, user , isBot = false) {
        this.name = name;
        this.pile = pile;
        this.user = user;
        this.isBot = isBot;
        this.playerStatus = Enums.PlayerStatusEnum.Idle;
    }

}

module.export = PlayerModel;