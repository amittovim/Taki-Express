import React, {Component} from 'react';

// props:
//  game : game

export default class GameListItem extends Component {
    render() {

        return (
            <li  className="list-group-item ">
                <div className="game-list-info">
                    <div className="info-left">
                        game name : {this.props.game.name} <br/>
                        game owner: {this.props.game.owner} <br/>
                    </div>
                    <div className="info-right">
                        game is for {this.props.game.numOfExpectedPlayers} players <br/>
                        {this.props.game.numOfEnlistedPlayers} players already enlisted <br/>
                    </div>
                </div>
            </li>
        );
    }

    constructor(props) {
        super(...props);
    }
}

