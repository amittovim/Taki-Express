import React, {Component} from 'react';
// <PROPS>
// numOfNeededPlayers : int

class WaitingMessageComponent extends Component {
    render() {
        return (
            <div>
                <div className="game-room-component">
                    <h1>{`Waiting for ${this.props.numOfNeededPlayers } players...`}</h1>
                </div>
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {};
    }
}

export default WaitingMessageComponent;
