import React, {Component} from 'react';
import './game-list-item.component.css';
// props:
//  game : game

export default class GameListItem extends Component {
    render() {
    debugger;
        return (
            <li onClick={ () => window.alert(this.props.game.name)} className="list-group-item ">
                <div className="game-list-info">
                    <div className="info-left">
                        game name : {this.props.game.name} <br/>
                        game owner: {this.props.game.owner.name} <br/>
                    </div>
                    <div className="info-right">
                        game is for {this.props.game.numOfExpectedPlayers} players <br/>
                        {this.props.game.botPlayerEnabled === true
                            ? (<div>player {this.props.game.numOfExpectedPlayers} will be played by computer</div>)
                            : (<div/>)}
                        <div>{this.props.game.numOfEnlistedPlayers} players already enlisted </div>
                        <div>{this.props.game.numOfExpectedPlayers - this.props.game.numOfEnlistedPlayers} players are needed for the game to start </div>

                    </div>
                </div>
            </li>
        );
    }

    constructor(props) {
        super(...props);
    }
}

