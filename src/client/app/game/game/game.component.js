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
                        abortGameCallback={this.handleOpenModal}
                        gameHistoryCallback={this.handleGetGameHistory}
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

        this.requestMoveCard = this.requestMoveCard.bind(this);
        this.handleIllegalMove = this.handleIllegalMove.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.humanMoveCardHandler = this.humanMoveCardHandler.bind(this);
        this.updateAverageTime = this.updateAverageTime.bind(this);
        this.handleGetGameHistory = this.handleGetGameHistory.bind(this);
        // this.startGame = this.startGame.bind(this);
        this.processStateChanges = this.processStateChanges.bind(this);


        this.handlePlayMove = this.handlePlayMove.bind(this);
        this.requestCardChangeColor = this.requestCardChangeColor.bind(this);
        this.requestPlayerMove = this.requestPlayerMove.bind(this);
        this.getGameContent = this.getGameContent.bind(this);
        this.openColorPicker = this.openColorPicker.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);
        this.updateGameStateFromHistory = this.updateGameStateFromHistory.bind(this);
        //this.findCardPileByCardId = this.findCardPileByCardId.bind(this);
        //this.getIsMoveLegal = this.getIsMoveLegal.bind(this);
        this.getCardById = this.getCardById.bind(this);

        this.closeGameOverLoserModal = this.closeGameOverLoserModal.bind(this);
        this.openGameOverLoserModal = this.openGameOverLoserModal.bind(this);
        this.close1stPlaceWinnerModal = this.close1stPlaceWinnerModal.bind(this);
        this.open1stPlaceWinnerModal = this.open1stPlaceWinnerModal.bind(this);
        // this.closeGameOverLoserModal = this.closeGameOverLoserModal.bind(this);
        // this.openGameOverLoserModal = this.openGameOverLoserModal.bind(this);
        this.getGameContent();
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    componentWillReceiveProps() {
    }

    componentWillUpdate() {
        // if (this.state.GameState.isGameOver) {
        //     this.props.endGameHandler();
        // }
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    getGameContent() {
        this.fetchGameContent()
            .then(contentFromServer => {
                // contentFromServer.GameState.consoleMessage='';
                let historyFromServer = contentFromServer.history;

                let historyFromServerObject = {'history': contentFromServer.history};
                let statesDifference = historyFromServer.length - this.state.history.length;
                if (statesDifference !== 0) {
                    this.setState(() => {
                        return historyFromServerObject;
                    }, () => {
                        let intervalId = setInterval(() => {
                            this.updateGameStateFromHistory();
                            if (--statesDifference === 0) {
                                window.clearInterval(intervalId);

                                this.setState(() => {
                                    return ({isLoading: false});
                                }, () => {
                                    this.setState(() => {
                                        return ({
                                            GameState: {
                                                currentPlayer: contentFromServer.GameState.currentPlayer,
                                                piles: contentFromServer.GameState.piles

                                            },
                                            ...contentFromServer
                                        });
                                    }, () => {
                                        if (this.state.GameState.isGameOver) {
                                            this.setState(() => {
                                                return ({
                                                    isActive: false
                                                });
                                            })
                                        }
                                    });
                                });

                            }
                        }, 300);
                    });
                }

            })
            .catch(err => {
                throw err
            });
    }

    updateGameStateFromHistory() {
        let isLoadingStateObject;
        (this.state.isLoading === true)
            ? isLoadingStateObject = {}
            : isLoadingStateObject = {'isLoading': true};
        let currentGameStateId = this.state.GameState.id;
        this.setState(() => {
            let GameState = {
                'GameState': this.state.history[currentGameStateId],
                ...isLoadingStateObject
            };
            return GameState;
        }, () => {
            if (this.state.GameState.isGameOver) {
                this.openGameOverLoserModal();
            }
            else if (this.state.winners.length === 1 && this.state.winners[0].name === this.state.GameState.currentPlayer.name) {
                this.open1stPlaceWinnerModal();
            }
            else if (this.state.winners.length === 2 && this.state.winners[1].name === this.state.GameState.currentPlayer.name) {
                this.open2ndPlaceWinnerModal();
            }
        });
    }

    openGameOverLoserModal() {
        this.setState((prevState) => {
            return {
                modal: {
                    isOpen: true,
                    type: ModalTypeEnum.GameOverLoser,
                    callback: this.closeGameOverLoserModal
                }
            };
        });
    }


    closeGameOverLoserModal() {
        debugger;
        this.setState(() => {
            return {
                modal: {
                    isOpen: false,
                    type: null,
                    callback: null
                }
            };
        }, () => {
            debugger;
            this.props.endGameHandler();
        });


    }

    open1stPlaceWinnerModal() {
        this.setState((prevState) => {
            return {
                modal: {
                    isOpen: true,
                    type: ModalTypeEnum.FirstPlaceWinner,
                    callback: this.close1stPlaceWinnerModal
                }
            };
        });
    }

    close1stPlaceWinnerModal() {
        this.setState(() => {
            return {
                modal: {
                    isOpen: false,
                    type: null,
                    callback: null
                }
            };
        });
    }

    openGameOverModal() {
        this.setState((prevState) => {
            return {
                modal: {
                    isOpen: true,
                    type: ModalTypeEnum.GameOver,
                    callback: this.closeGameOverModal
                }
            };
        });
    }

    closeGameOverModal() {
        this.setState(() => {
            return {
                modal: {
                    isOpen: false,
                    type: null,
                    callback: null
                }
            };
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

    getCardById(cardId) {
        const GameState = this.state.GameState;
        let gameCards = GameState.piles[PileIdEnum.DrawPile].cards
            .concat(GameState.piles[PileIdEnum.DiscardPile].cards,
                GameState.piles[PileIdEnum.Two].cards,
                GameState.piles[PileIdEnum.Three].cards);
        if (GameState.piles[PileIdEnum.Four] !== undefined) {
            gameCards.concat(GameState.piles[PileIdEnum.Four].cards);
        }
        if (GameState.piles[PileIdEnum.Five] !== undefined) {
            gameCards.concat(GameState.piles[PileIdEnum.Five].cards);
        }
        return gameCards.filter((card) => {
            return card.id === cardId
        })[0];
    }

    handlePlayMove(cardId) {
        const body = cardId;
        let answer;
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
                    this.openColorPicker(card);
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

    openColorPicker(card) {
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

    /*
        startGame() {
            this.handleCloseModal();
            this.setState(GameApiService.getInitialState(), () => {
                if (this.state.currentPlayer === PlayerEnum.Bot) {
                    this.requestStateUpdate();
                }
            });
        }
    */

// Stats:

    getStats() {
        const data = {
            turnNumber: this.state.turnNumber,
            averageMinutes: this.state.averageMoveTime.minutes,
            averageSeconds: this.state.averageMoveTime.seconds,
            // singleCardCounter: getPlayerPile(this.state.currentPlayer).singleCardCounter // TODO,
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
        this.setState((prev) => {
            return (
                {
                    ...prev,
                    GameState: {
                        ...prev.GameState,
                        consoleMessage: 'illegal move... try again '
                    }       //TODO: fix this line so console will show error
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
                return this.removePlayerBeforeGameStarts();       //todo: this should abort the game if it hasnt started yet
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

    removePlayerBeforeGameStarts() {

    }
}


export default Game;
