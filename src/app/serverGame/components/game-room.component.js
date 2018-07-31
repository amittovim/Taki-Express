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
                        onClick={fetch('/game/' + this.gameId, {method: 'PUT', credentials: 'include'})} />
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            counterValue : 0,
            lastUpdater: null
        };
        this.stateStack = [];
        this.gameId = this.props.chosenGame.id;

        this.fetchGameContent = this.fetchGameContent.bind(this);
        this.getGameContent = this.getGameContent.bind(this);

        this.getGameContent(this.gameId);

    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getGameContent();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    getGameContent(gameId) {
        this.fetchGameContent(gameId)
            .then(content => {
                const clientStateInfo = content;
                if (clientStateInfo.id === this.state.id+1) {
                    stateStack.push(clientStateInfo);
                }
                this.setState(()=>({content}));
            })
            .catch(err => {throw err});
    }

    fetchGameContent(gameId) {
        return fetch('/game/' + gameId, {method: 'GET', credentials: 'include'})
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                this.timeoutId = setTimeout(this.getGameContent, 200);
                return res.json();
            });
    }

    translateContent2Server(contentFromServer) {

    }
}










export default GameRoom;
