import React, {Component} from 'react';
import './game-list-item.component.css';
import Button from "../../shared/components/button/button.component";

// props:
// key :
// game : game
// successfulGameChoosingHandler : function
// deleteGameHandler : function

export default class GameListItem extends Component {
    render() {
        return (
            <li
                // onClick={() => this.onClickHandler() }
                className="list-group-item ">
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
                        <div>{this.props.game.numOfEnlistedPlayers} players already enlisted</div>
                        <div>{this.props.game.numOfExpectedPlayers - this.props.game.numOfEnlistedPlayers} players are
                            needed for the game to start
                        </div>

                    </div>
                </div>
                <Button label='Delete' onClick={this.deleteGameHandler}/>
            </li>
        );
    }

    constructor(props) {
        super(...props);

        this.onClickHandler = this.onClickHandler.bind(this);
        this.deleteGameHandler = this.deleteGameHandler.bind(this);
    }

    onClickHandler() {
        if (this.props.game.hasStarted) {
            return null;
        } else {
            this.props.successfulGameChoosingHandler(this.props.game);
        }

    }

    deleteGameHandler() {
        this.props.deleteGameHandler(this.props.game.id);
    }

}

