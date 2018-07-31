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
                onClick={() => this.onClickHandler()}
                className="game-list-item ">
                <div className="game-list-info">
                    <div className="info-left">
                        game name : {this.props.game.name} <br/>
                        game owner: {this.props.game.owner.name} <br/>
                    </div>
                    <div className="info-right">
                        game is for {this.props.game.playersCapacity} players <br/>
                        {this.props.game.isBotEnabled === true
                            ? (<div>player {this.props.game.playersCapacity} will be played by computer</div>)
                            : (<div/>)}
                        <div>{this.props.game.playersEnrolled} players already enlisted</div>
                        {this.props.game.isActive === true
                            ? (<div>Game has started and is Active </div>)
                            : (<div>Game is
                                awaiting {this.props.game.playersCapacity - this.props.game.playersEnrolled} players to
                                started </div>)}
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
        if (this.props.game.isActive === true) {
            return null;
        } else {
            this.props.successfulGameChoosingHandler(this.props.game);
        }

    }

    deleteGameHandler() {
        this.props.deleteGameHandler(this.props.game.id);
    }

}

