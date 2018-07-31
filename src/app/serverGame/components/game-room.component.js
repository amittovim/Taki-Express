import React, {Component} from 'react';
import './game.component.css';
import * as GameService from '../../game/game.service';
import * as GameApiService from '../../game/game-api.service';
import Board from "../../game/board/board.component";
import {GameStatusEnum} from "../../../logic/game-status.enum";
import {CardActionEnum} from "../../enums/card-action-enum";
import {ModalTypeEnum} from "../../game/modal/modal-type.enum";
import Modal from "../../game/modal/modal.component";
import {PlayerEnum} from "../../enums/player.enum";
import Navbar from "../../game/navbar/navbar.component";
import Loader from "../../shared/components/loader/loader.component";
import Console from "../../game/console/console.component";
import Overlay from "../../shared/components/overlay/overlay.component";
import {getPlayerPile} from "../../../logic/utils/game.utils";
import Button from "../../shared/components/button/button.component";

class GameRoom extends Component {
    render() {
        return (
            <div className="game-room-component">
                <div>current counter value: {this.state.counterValue}</div>
                <div>last updater : {this.state.lastUpdater} </div>
                <Button label="increment counter"
                        onClick={this.props.handleClick} />
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

        this.fetchGameContent = this.fetchGameContent.bind(this);
        this.getGameContent = this.getGameContent.bind(this);


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
            .then(contentFromServer => {
                const clientStateInfo = this.translateContent2Server(contentFromServer);
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
                this.timeoutId = setTimeout(this.getChatContent, 200);
                return res.json();
            });
    }

    translateContent2Server(contentFromServer) {

    }
}










export default GameRoom;
