import React, {Component} from 'react';
import './winner-modal.component.css';
import Button from "../../../shared/components/button/button.component";

// onSubmit: Function
// onCancel: Function
// data: any

class WinnerModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="winner-modal-component">
                <h1>Congratulations! {this.props.playerName} has won {this.props.winningPlace} place</h1>
                <div className='buttons-area'>
                    <Button label="Ok"
                            onClick={this.props.onSubmit} />
                </div>
            </div>
        );
    }
}

export default WinnerModal;
