import React, {Component} from 'react';
import './game.component.css';
import Navbar from "../navbar/navbar.component";
import Loader from "../../shared/components/loader/loader.component";
import Overlay from "../../shared/components/overlay/overlay.component";
import Modal from "../modal/modal.component";
import Console from "./console/console.component";
import AdvancedBoard from "./advanced-board/advanced-board";
import WaitingMessageComponent from "./waiting-message-component";
import * as GameApiService from "./game-api.service";
import {ModalTypeEnum} from "../modal/modal-type.enum";
import {PileIdEnum} from "../../enums/pile-id.enum";
import {CardActionEnum} from "../../enums/card-action-enum";
import * as GameService from "./game.service";
import ChatContainer from "./chat/chat-container.component";
import * as Enums from "../../../../server/enums-node";
import * as ReactDom from "react-dom";
// <PROPS>
// game: Game object
// userName: string
// endGameHandler : Function
// handleSuccessfulGameLeaving : Function
class Game extends Component {

    render() {
        return (
            <div className="game-component">
                <Navbar currentPlayer={this.state.GameState.currentPlayer}
                        turnNumber={this.state.GameState.turnNumber}
                        isGameOver={this.state.GameState.isGameOver}
                        abortGameCallback={this.handleOpenStatsModal}
                        gameHistoryCallback={this.handleGetGameHistory}
                        openModalCallback={this.handleOpenStatsModal}
                        emitAverageTime={this.updateAverageTime}/>
                <Loader isLoading={this.state.isLoading}/>
                <Overlay isVisible={this.state.isLoading || this.state.modal.isOpen || this.state.isGameOver}/>
                <Modal isOpen={this.state.modal.isOpen}
                       type={this.state.modal.type}
                       callback={this.state.modal.callback}
                       restartGameCallback={this.startGame}
                       data={this.state.modal.data}
                       closeModal={this.handleCloseModal}/>
                <div className="game-body">
                    {this.state.playersCapacity > this.state.playersEnrolled
                        ? (<WaitingMessageComponent game={this.props.game}
                                                    handleSuccessfulGameLeaving={this.props.handleSuccessfulGameLeaving}
                                                    numOfNeededPlayers={(this.state.playersCapacity - this.state.playersEnrolled)}/>)
                        : ((<AdvancedBoard userName={this.props.userId}
                                           currentPlayerName={this.state.GameState.currentPlayer.name}
                                           piles={this.state.GameState.piles}
                                           playersCapacity={this.state.playersCapacity}
                                           moveCardDriver={this.handlePlayMove}/>))
                        /*moveCardDriver={this.requestPlayerMove}/>))*/

                    }
                </div>
                {/*<Console message={this.state.consoleMessage}/>*/}
                <ChatContainer gameId={this.state.id}
                               consoleMessage={this.state.GameState.consoleMessage}/>
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            // API data:
            id: null,
            name: '',
            owner: null,
            playersCapacity: null,
            playersEnrolled: null,
            isBotEnabled: false,
            GameState: {
                id: null,
                players: [],
                currentPlayer: null,
                piles: [],
                leadingCard: null,
                actionInvoked: null,
                turnNumber: 0,
                movesCounter: 0,
                twoPlusCounter: 0,
                consoleMessage: '',
                gameStatus: '',
            },
            history: [],
            isActive: false,
            winners: [],
            ...this.props.game,

            // UI data:
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

        this.card = null;


        this.updateSelectedCard = this.updateSelectedCard.bind(this);
        this.handleIllegalMove = this.handleIllegalMove.bind(this);
        this.handleOpenStatsModal = this.handleOpenStatsModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.humanMoveCardHandler = this.humanMoveCardHandler.bind(this);
        this.updateAverageTime = this.updateAverageTime.bind(this);
        this.handlePlayMove = this.handlePlayMove.bind(this);
        this.requestCardChangeColor = this.requestCardChangeColor.bind(this);
        this.requestPlayerMove = this.requestPlayerMove.bind(this);
        this.openColorPickerModal = this.openColorPickerModal.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);
        this.getCardById = this.getCardById.bind(this);
        this.getGameHistory = this.getGameHistory.bind(this);

        // Modals:
        this.openGameOverLoserModal = this.openGameOverLoserModal.bind(this);
        this.closeGameOverLoserModal = this.closeGameOverLoserModal.bind(this);
        this.openWinnerModal = this.openWinnerModal.bind(this);
        this.closeWinnerModal = this.closeWinnerModal.bind(this);

        this.getGameHistory();
        // this.getGameContent();
    }


    componentWillMount() {
    }

    componentDidMount() {

    }

    componentWillReceiveProps() {
    }

    componentWillUpdate(prevState) {
    }

    // if (this.state.GameState.isGameOver) {
    //     this.openGameOverLoserModal();
    // }
    // else if (this.state.winners.length === 1 && this.state.winners[0].name === this.state.GameState.currentPlayer.name) {
    //     this.openWinnerModal();
    // }
    // else if (this.state.winners.length === 2 && this.state.winners[1].name === this.state.GameState.currentPlayer.name) {
    //     this.open2ndPlaceWinnerModal();
    // }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.GameState.isGameOver && this.state.GameState.isGameOver) {
            let timerId = setTimeout(this.openGameOverLoserModal, 700, this.state.GameState.loser);
        }
        else if (prevState.winners.length < this.state.winners.length) {
            const winningPlace = this.state.winners.length;
            this.openWinnerModal(winningPlace);
        }
        this.stateUpdateTimeoutId = setTimeout(() => {
            if (this.state.GameState.id <= this.state.history.length - 1) {
                const nextStateUpdate = this.state.history[this.state.GameState.id];
                this.animatingCard(this.state.GameState, nextStateUpdate);
                this.setState(() => ({
                    GameState: nextStateUpdate,
                    isLoading: true,
                    //nextStateId: this.state.nextStateId + 1
                }));
            } else {
                clearTimeout(this.stateUpdateTimeoutId);
                this.getCurrentGameState();

            }
        }, 200);
    }

    animatingCard(futureState, currentState) {
        let movingInfo;
        movingInfo.cardToMove = futureState.selectedCard;
        movingInfo.sourcePileId = this.getCardById(futureState.selectedCard.id).parentPileId;
        switch (movingInfo.sourcePileId) {
            case 0: {
                movingInfo.destinationPileId = futureState.currentPlayer.pile.id;
                return;
            }
            case 1: {
                movingInfo.destinationPileId = Enums.PileIdEnum.DrawPile;
                return;
            }
            case 2:
            case 3:
            case 4:
            case 5: {
                movingInfo.destinationPileId = Enums.PileIdEnum.DiscardPile;
                return;
            }
            default: {
            }
        }
        movingInfo.destinationPileDOM = ReactDom.findDOMNode().getBoundingClientRect(); ;


    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        if (this.timeoutHistoryId) {
            clearTimeout(this.timeoutHistoryId);
        }
        if (this.stateUpdateTimeoutId) {
            clearTimeout(this.stateUpdateTimeoutId);
        }
    }

    getGameHistory() {
        this.fetchGameHistory()
            .then(gameHistory => {

                this.setState({history: gameHistory, nextStateId: 0})
            });
    }

    getCurrentGameState() {
        this.fetchGameContent()
            .then(game => {
                //game.GameState.consoleMessage = '';
                this.setState({
                    ...game,
                    GameState: game.GameState,
                    isLoading: false,
                    //isActive: !prevState.GameState.isGameOver
                });
            });
    }

    fetchGameContent() {
        return fetch('/game/' + this.state.id, {method: 'GET', credentials: 'include'})
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                this.timeoutId = setTimeout(this.getGameContent, 1500);
                return res.json();
            });
    }

    fetchGameHistory() {
        return fetch('/game/history/' + this.state.id, {method: 'GET', credentials: 'include'})
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                this.timeoutHistoryId = setTimeout(this.getGameHistory, 1500);
                return res.json();
            });
    }


    getCardById(cardId) {
        const GameState = this.state.GameState;
        let gameCards = GameState.piles[PileIdEnum.DrawPile].cards
            .concat(GameState.piles[PileIdEnum.DiscardPile].cards,
                GameState.piles[PileIdEnum.Two].cards,
                GameState.piles[PileIdEnum.Three].cards);
        if (GameState.piles[PileIdEnum.Four] !== undefined) {
            gameCards = gameCards.concat(GameState.piles[PileIdEnum.Four].cards);
        }
        if (GameState.piles[PileIdEnum.Five] !== undefined) {
            gameCards = gameCards.concat(GameState.piles[PileIdEnum.Five].cards);
        }
        return gameCards.filter((card) => {
            return card.id === cardId
        })[0];
    }

    handlePlayMove(cardId) {
        const body = cardId;
        let answer;
        this.setState({
            isLoading: true,
        });
        return fetch('/game/isMoveLegal/' + this.state.id, {method: 'PUT', body: body, credentials: 'include'})
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(answerFrmServer => {
                answer = answerFrmServer;
                const card = this.getCardById(cardId);
                if (!answer) {
                    return this.handleIllegalMove();
                } else if (card.action === CardActionEnum.ChangeColor &&
                    this.state.GameState.piles[card.parentPileId].isHand === true) {
                    this.openColorPickerModal(card);
                } else {
                    this.requestPlayerMove(cardId);
                }
                return answer;
            })
            .catch(err => {
                if (err.status === 403) { // in case we're getting 'forbidden' as response

                } else {
                    throw err; // in case we're getting an error
                }
            });
    }

    requestPlayerMove(cardId) {
        const body = cardId;
        fetch('/game/' + this.state.id, {method: 'PUT', body: body, credentials: 'include'})
            .then(res => {
                (!res.ok)
                    ? console.log(`'Failed to move card in game named ${this.state.name}! response content is: `, res)
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

    requestCardChangeColor(gameId, cardId, cardColor) {
        const body = {cardId, cardColor};
        fetch('/game/changeColor/' + gameId, {method: 'PUT', body: JSON.stringify(body), credentials: 'include'})
            .then(res => {
                if (!res.ok) {
                    console.log(`'Failed to change card color in a game named ${this.state.name}!`);
                    throw res;
                }
                return res;
            })
            .then(content => { // what ever you want to do with the positive response
                this.requestPlayerMove(cardId);
            })
            .catch(err => {
                if (err.status === 403) { // in case we're getting 'forbidden' as response

                } else {
                    throw err; // in case we're getting an error
                }
            });
    }

    handleChangeColor(selectedColor) {
        this.setState((prevState) => {
            return {
                modal: {
                    isOpen: false,
                    type: null,
                    callback: null
                }
            };
        }, () => {
            let cardId = this.card.id;
            let gameId = this.state.id;
            this.requestCardChangeColor(gameId, cardId, selectedColor);
        });
    }

// MODALS:

    openColorPickerModal(card) {
        this.card = card;
        this.setState((prevState) => {
            return {
                gameState: {
                    selectedCard: card
                },
                modal: {
                    isOpen: true,
                    type: ModalTypeEnum.ColorPicker,
                    callback: this.handleChangeColor
                }
            };
        });
    }

    openGameOverLoserModal() {
        this.setState((prevState) => {
            return {
                modal: {
                    isOpen: true,
                    type: ModalTypeEnum.GameOverLoser,
                    callback: this.closeGameOverLoserModal,
                    data: {
                        playerName: this.state.GameState.currentPlayer.name
                    }
                }
            };
        });
    }

    closeGameOverLoserModal() {
        this.setState(() => {
            return {
                modal: {
                    isOpen: false,
                    type: null,
                    callback: null,
                    data: null
                }
            };
        }, () => {
            this.props.endGameHandler();
        });
    }

    openWinnerModal(winningPlace) {
        this.setState((prevState) => {
            return {
                modal: {
                    isOpen: true,
                    type: ModalTypeEnum.Winner,
                    callback: this.closeWinnerModal,
                    data: {
                        winningPlace,
                        playerName: this.state.GameState.currentPlayer.name
                    }
                }
            };
        });
    }

    closeWinnerModal() {
        this.setState(() => {
            return {
                modal: {
                    isOpen: false,
                    type: null,
                    callback: null,
                    data: null
                }
            };
        });
    }

// Stats:

    // getStats() {
    //     this.setState({
    //         turnNumber: this.state.turnNumber,
    //         averageMinutes: this.state.averageMoveTime.minutes,
    //         averageSeconds: this.state.averageMoveTime.seconds,
    //     });
    // }

    updateAverageTime(averageMoveTime) {
        this.setState({
            averageMoveTime: {
                minutes: averageMoveTime.minutes,
                seconds: averageMoveTime.seconds
            }
        })
    }

    handleIllegalMove() {
        this.setState((prev) => {
            return (
                {
                    ...prev,
                    GameState: {
                        ...prev.GameState,
                        consoleMessage: 'illegal move... try again '
                    }
                });
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

    exitToTakiWiki() {
        window.location.href = 'https://en.wikipedia.org/wiki/Taki_(card_game)';
    }


// Modal

    handleOpenStatsModal(modalType) {
        let callback = this.getModalCallback(modalType);
        this.setState({
            modal: {
                isOpen: true,
                type: modalType,
                callback: callback
            },
            turnNumber: this.state.turnNumber,
            averageMinutes: this.state.averageMoveTime.minutes,
            averageSeconds: this.state.averageMoveTime.seconds,
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
                return this.removePlayerBeforeGameStarts();
            }
            default: {
                return null;
            }
        }
    }
}

export default Game;
