import React, {Component} from 'react';
import './first-place-winner-modal.component.css';
import Button from "../../../shared/components/button/button.component";

// onSubmit: Function
// onCancel: Function

class FirstPlaceWinnerModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="first-place-winner-modal-component">
                <h1>player is the winner </h1>
                <div className='buttons-area'>
                    <Button label="Ok"
                            onClick={this.props.handleClick} />
                </div>
            </div>
        );
    }
}

export default FirstPlaceWinnerModal ;
