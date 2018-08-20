import React, {Component} from 'react';
import './game-over-loser-modal.component.css';
import Button from "../../../shared/components/button/button.component";

// onSubmit: Function
// onCancel: Function

class GameOverLoserModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="game-over-loser-modal-component">
                <h1>Game Over!</h1>
                <h2> Player has lost the game</h2>
                <div className='buttons-area'>
                    <Button label="ok"
                            onClick={this.props.onSubmit} />
                </div>
            </div>
        );
    }
}

export default GameOverLoserModal;
