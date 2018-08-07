import React, {Component} from 'react';
import './game.component.css';
import * as GameService from './game.service';
import * as GameApiService from './game-api.service';
import {GameStatusEnum} from "../../logic/game-status.enum";
import {CardActionEnum} from "../enums/card-action-enum";
import {ModalTypeEnum} from "./modal/modal-type.enum";
import Modal from "./modal/modal.component";
import {PlayerEnum} from "../enums/player.enum";
import Navbar from "./navbar/navbar.component";
import Loader from "../shared/components/loader/loader.component";
import Console from "./console/console.component";
import Overlay from "../shared/components/overlay/overlay.component";
import {getPlayerPile} from "../../logic/utils/game.utils";
import AdvancedBoard from "./advanced-board/advanced-board";
import WaitingMessageComponent from "../serverGame/components/waiting-message-component";
import {ViewsEnum} from "../enums/views-enum";
// <PROPS>
// game: Game object

class Game extends Component {
    render() {
        return (
            <div className="game-component">
                <Navbar currentPlayer={this.state.GameState.currentPlayer}
                        turnNumber={this.state.GameState.turnNumber}
                        isGameOver={this.state.isGameOver}
                        abortGameCallback={this.handleOpenModal}
                        gameHistoryCallback={this.handleGetGameHistory}
                        restartGameCallback={this.startGame}
                        openModalCallback={this.handleOpenModal}
                        emitAverageTime={this.updateAverageTime}/>
                <Loader isLoading={this.state.isLoading}/>
                <Overlay isVisible={this.state.isLoading || this.state.modal.isOpen || this.state.isGameOver}/>
                <Modal isOpen={this.state.modal.isOpen}
                       type={this.state.modal.type}
                       callback={this.state.modal.callback}
                       restartGameCallback={this.startGame}
                       data={this.getStats()}
                       closeModal={this.handleCloseModal}/>
                <div>
                    {this.state.playersCapacity > this.state.playersEnrolled
                        ? (<WaitingMessageComponent numOfNeededPlayers ={(this.state.playersCapacity - this.state.playersEnrolled)} />)
                        : ((<AdvancedBoard drawPile={this.state.DrawPile}
                                           discardPile={this.state.DiscardPile}
                                           humanPile={this.state.HumanPile}
                                           botPile={this.state.BotPile}
                                           moveCardDriver={this.humanMoveCardHandler}/>))
                    }
                </div>
                <Console message={this.state.consoleMessage}/>
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            gameId: this.props.game.id,
            ...this.props.game,


            DrawPile: null,
            DiscardPile: null,
            HumanPile: null,
            BotPile: null,
            human: null,
            bot: null,
            currentPlayer: null,
            actionInvoked: null,
            leadingCard: null,
            selectedCard: null,
            consoleMessage: '',
            turnNumber: 0,
            modal: {
                isOpen: null,
                type: null,
                callback: null
            },
            averageMoveTime: {
                minutes: 0,
                seconds: 0
            },
            isLoading: false,
            isGameOver: false
        };
        this.updateSelectedCard = this.updateSelectedCard.bind(this);
        this.handlePlayMove = this.handlePlayMove.bind(this);
        this.openColorPicker = this.openColorPicker.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);
        this.requestMoveCard = this.requestMoveCard.bind(this);
        this.handleIllegalMove = this.handleIllegalMove.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.humanMoveCardHandler = this.humanMoveCardHandler.bind(this);
        this.updateAverageTime = this.updateAverageTime.bind(this);
        this.handleGetGameHistory = this.handleGetGameHistory.bind(this);
        this.startGame = this.startGame.bind(this);
        this.processStateChanges = this.processStateChanges.bind(this);


        this.requestCardChangeColor = this.requestCardChangeColor.bind(this);
        this.requestPlayMove2Server = this.requestPlayMove2Server.bind(this);
        this.getGameContent = this.getGameContent.bind(this);

        this.getGameContent();
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    componentWillUpdate() {
    }


    componentDidUpdate() {
    }

    componentWillMount() {
      //   this.startGame();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    getGameContent() {
        this.fetchGameContent()
            .then(contentFromServer => {
                debugger;
/*
                if (contentFromServer.id === this.state.id+1) {
                    stateStack.push(contentFromServer);
                }
*/
                this.setState(()=> { return contentFromServer;} );
            })
            .catch(err => {throw err});
    }

    fetchGameContent() {
        return fetch('/game/' + this.state.gameId, {method: 'GET', credentials: 'include'})
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                this.timeoutId = setTimeout(this.getGameContent, 200);
                return res.json();
            });
    }

    requestPlayMove2Server(gameId,cardId) {
        const body = { cardId };
        fetch('/game/' + gameId, {method: 'PUT', body:JSON.stringify(body) , credentials: 'include'})
            .then(res => {
                (!res.ok)
                    ? console.log(`'Failed to move card in game named ${this.state.game.name}! response content is: `, res)
                    : res.json();
            })
            .then(content => {
                // what ever you want to do with the positive response
            })
            .catch(err => {
                if (err.status === 403) { // in case we're getting 'forbidden' as response

                } else {
                    throw err; // in case we're getting an error
                }
            });
    }


    requestCardChangeColor(gameId,cardId, cardColor) {
        const body = { cardId, cardColor };
        fetch('/game/changeColor' + gameId, {method: 'PUT', body:JSON.stringify(body) , credentials: 'include'})
            .then(res => {
                (!res.ok)
                    ? console.log(`'Failed to change card color in the game named ${this.state.game.name}! response content is: `, res)
                    : res.json();
                })
            .then(content => {
                // what ever you want to do with the positive response
            })
            .catch(err => {
                if (err.status === 403) { // in case we're getting 'forbidden' as response

                } else {
                    throw err; // in case we're getting an error
                }
            });
    }


    startGame() {
        this.handleCloseModal();
        this.setState(GameApiService.getInitialState(), () => {
            if (this.state.currentPlayer === PlayerEnum.Bot) {
                this.requestStateUpdate();
            }
        });
    }

    openColorPicker() {
        this.setState((prevState) => {
            return {
                modal: {
                    isOpen: true,
                    type: ModalTypeEnum.ColorPicker,
                    callback: this.handleChangeColor
                }
            };
        });
    }

    // Stats:

    getStats() {
        const data = {
            turnNumber: this.state.turnNumber,
            averageMinutes: this.state.averageMoveTime.minutes,
            averageSeconds: this.state.averageMoveTime.seconds,
            singleCardCounter: getPlayerPile(this.state.currentPlayer).singleCardCounter // TODO,
        };
        return data;
    }

    updateAverageTime(averageMoveTime) {
        this.setState({
            averageMoveTime: {
                minutes: averageMoveTime.minutes,
                seconds: averageMoveTime.seconds
            }
        })
    }

    handleIllegalMove() {
        this.setState({
            consoleMessage: 'illegal move'
        });
    }

    humanMoveCardHandler(card) {
        if (this.state.currentPlayer === PlayerEnum.Human) {
            this.updateSelectedCard(card);
        }
    }

    updateSelectedCard(card) {
        this.setState({selectedCard: card}, () => {
            this.handlePlayMove();
        });
    }

    handlePlayMove() {
        const isMoveLegal = GameService.isHumanMoveLegal(this.state.selectedCard, this.state.DrawPile, this.state.actionInvoked, this.state.leadingCard, this.state.HumanPile);
        if (!isMoveLegal) {
            return this.handleIllegalMove();
        } else if (this.state.selectedCard.action === CardActionEnum.ChangeColor &&
            this.state[this.state.selectedCard.parentPileType].isHand === true) {
            this.openColorPicker();
        } else {
            this.requestMoveCard();
        }
    }

    handleChangeColor(selectedColor) {
        let card = this.state.selectedCard;
        card.color = selectedColor;
        this.setState({
            modal: {
                isOpen: false
            },
            selectedCard: card

        });
        this.requestMoveCard();
    }

    exitToTakiWiki() {
        window.location.href = 'https://en.wikipedia.org/wiki/Taki_(card_game)';
    }


    // Modal

    handleOpenModal(modalType) {
        let callback = this.getModalCallback(modalType);
        this.setState((prevState) => {
            return {
                modal: {
                    isOpen: true,
                    type: modalType,
                    callback: callback
                }
            };
        });
    }

    handleCloseModal() {
        this.setState({
            modal: {
                isOpen: false
            },
        });
    }

    getModalCallback(modalType) {
        switch (modalType) {
            case ModalTypeEnum.AbortGame: {
                return this.exitToTakiWiki;
            }
            default: {
                return null;
            }
        }
    }


    // API

    requestMoveCard() {
        GameApiService.requestMoveCard(this.state.selectedCard.id)
            .then(response => {
                if (GameStatusEnum.Ongoing) {
                    this.setState({
                        ...response.body,
                    }, () => {
                        this.intervalId = setTimeout(this.processStateChanges, 1000)
                    });
                }
            });
    }

    processStateChanges() {
        if (this.state.currentPlayer !== PlayerEnum.Human) {
            this.setState({
                isLoading: true
            }, this.requestStateUpdate);
        }
    }

    requestStateUpdate() {
        GameApiService.requestGameStateUpdate()
            .then(response => {
                this.setState({
                    ...response.body,
                    isLoading: false
                }, this.processStateChanges);
            })
            .catch(error => {
                console.error('Error', error);
            });
    }

    handleGetGameHistory(getNext) {
        GameApiService.getGameStateHistory(getNext)
            .then(response => {
                this.setState({
                    ...response.body,
                    isGameOver: true
                });
            })
    }
}

export default Game;
