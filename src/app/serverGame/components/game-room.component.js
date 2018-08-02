import React, {Component} from 'react';
import Button from "../../shared/components/button/button.component";

// props:
// ChosenGame : Game

class GameRoom extends Component {
    render() {
        return (
            <div className="game-room-component">
                <div>current counter value: {this.state.counterValue}</div>
                <div>last updater : {this.state.lastUpdater} </div>
                <Button label="increment counter"
                        /*onClick={this.handleUpdateGameContent(this.state.gameId)}*//>
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            counterValue: 0,
            lastUpdater: null,
            gameId: this.props.chosenGame.id
        };
        this.stateStack = [];
        // this.gameId = this.props.chosenGame.id;

        this.fetchGameContent = this.fetchGameContent.bind(this);
        this.getGameContent = this.getGameContent.bind(this);
        this.handleUpdateGameContent = this.handleUpdateGameContent.bind(this);
        debugger;
        this.getGameContent();


    }

    componentWillMount() {
    }

    componentDidMount() {
        debugger;
        this.getGameContent();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    getGameContent() {
        this.fetchGameContent(this.state.gameId)
            .then(content => {
                const clientStateInfo = content;
                if (clientStateInfo.id === this.state.id + 1) {

                }
                this.setState(() => ({clientStateInfo}));
            })
            .catch(err => {
                throw err
            });
    }

    fetchGameContent(gameId) {
        debugger;
        return fetch('/game/' + gameId, {method: 'GET', credentials: 'include'})
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                debugger;
                this.timeoutId = setTimeout(this.getGameContent, 2000);
                return res.json();
            });
    }

    handleUpdateGameContent(gameId) {
        fetch('/game/' + gameId, {method: 'PUT', credentials: 'include'})
            .then((res) => {
                debugger;
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(content => {
                const clientStateInfo = content;
                this.setState(() => ({clientStateInfo}));
            });
    }

    translateContent2Server(contentFromServer) {

    }
}


export default GameRoom;
