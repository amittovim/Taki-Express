import React, {Component} from 'react';
import Button from "../../shared/components/button/button.component";
// <PROPS>
// numOfNeededPlayers : int
// game : Object
// handleSuccessfulGameLeaving : Function
class WaitingMessageComponent extends Component {
    render() {
        return (
            <div>
                <div className="game-room-component">
                    <h1>{`Waiting for ${this.props.numOfNeededPlayers } players...`}</h1>
                </div>
                <Button label="Leave Game"
                        onClick={() => this.props.handleSuccessfulGameLeaving(this.props.game)}/>
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {};
    }
}

export default WaitingMessageComponent;
