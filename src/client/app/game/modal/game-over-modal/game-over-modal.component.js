import React, {Component} from 'react';
import './game-over-modal.component.css';
import Button from "../../../shared/components/button/button.component";

// onSubmit: Function
// onCancel: Function

class GameOverModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="game-over-modal-component">
                <h1>Game Over!</h1>
                <div className='buttons-area'>
                    <Button label="Ok"
                            onClick={this.props.handleClick} />
                </div>
            </div>
        );
    }
}

export default GameOverModal;
