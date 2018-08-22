import React, {Component} from 'react';
import './advanced-board.css';
import Hand from "../advanced-board/hand/hand.component";
import {PlayerEnum} from "../../../enums/player.enum";
import Deck from "../advanced-board/deck/deck.component";
import {PileIdEnum} from "../../../enums/pile-id.enum";
import * as ReactDom from "react-dom";

// <PROPS>
// piles: Pile[]
// userName: string
// playersCapacity: Number
// selectedCard : Card Object
class AdvancedBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainAreaPileId: null,
            secondAreaPileId: null,
            thirdAreaPileId: null,
            forthAreaPileId: null,


        };
        this.DOMCoordinates = null;


        // this.getCurrentUserPile = this.getCurrentUserPile.bind(this);
        this.moveCardDriver_1 = this.moveCardDriver_1.bind(this);
        this.checkUserOverFlow = this.checkUserOverFlow.bind(this);
        this.updateDOMCoordinates = this.updateDOMCoordinates.bind();

        this.updateDOMCoordinates();
    }

    render() {

        return (
            <div className="advanced-board-component">
                <div className='top-board'>
                    <div className='empty-space'></div>
                    <Hand owner={this.props.piles[this.state.secondAreaPileId].ownerPlayerName}
                          pile={this.props.piles[this.state.secondAreaPileId]}
                          moveCardDriver1={this.moveCardDriver_1}
                          DOMCoordinates={this.DOMCoordinates}
                          selectedCard={ this.props.selectedCard}
                    />
                    <div className='empty-space'></div>
                </div>
                <div className='middle-board'>
                    <div className='left-section'>
                        {(!this.state.thirdAreaPileId)
                            ? (null)
                            : (<Hand owner={this.props.piles[this.state.thirdAreaPileId].ownerPlayerName}
                                     pile={this.props.piles[this.state.thirdAreaPileId]}
                                     moveCardDriver1={this.moveCardDriver_1}
                                     DOMCoordinates={this.DOMCoordinates}
                                     selectedCard={ this.props.selectedCard}
                            />)}
                        {/*
                        <Hand owner={this.props.piles[this.state.thirdAreaPileId].ownerPlayerName}
                              pile={this.props.piles[this.state.thirdAreaPileId]}
                              moveCardDriver1={this.moveCardDriver_1}
                        />
*/}
                    </div>
                    <div className='center-section'>
                        <Deck drawPile={this.props.piles[PileIdEnum.DrawPile]}
                              discardPile={this.props.piles[PileIdEnum.DiscardPile]}
                              moveCardDriver0={this.moveCardDriver_1}
                              DOMCoordinates={this.DOMCoordinates}

                        />
                    </div>
                    <div className='right-section'>
                        {(!this.state.forthAreaPileId)
                            ? (null)
                            : (<Hand owner={this.props.piles[this.state.forthAreaPileId].ownerPlayerName}
                                     pile={this.props.piles[this.state.forthAreaPileId]}
                                     moveCardDriver1={this.moveCardDriver_1}
                                     DOMCoordinates={this.DOMCoordinates}
                                     selectedCard={ this.props.selectedCard}
                            />)}
                    </div>
                </div>
                <div className={`bottom-board ${this.props.currentPlayerName === this.player ? 'players-turn' : ''}`}>
                    <Hand className={`bottom-board-hand`}
                          owner={this.props.piles[this.state.mainAreaPileId].ownerPlayerName}
                          pile={this.props.piles[this.state.mainAreaPileId]}
                          moveCardDriver1={this.moveCardDriver_1}
                          DOMCoordinates={this.DOMCoordinates}
                          XYCoordinates={ {x:100,y:100}}
                          selectedCard={ this.props.selectedCard}
                    />
                </div>
            </div>
        );
    }

    componentWillMount() {
        this.realignCardHands();
    }

    componentWillUpdate() {

    }

    componentWillReceiveProps(props) {
        debugger;
    }

    get player() {
        return this.props.piles[this.state.mainAreaPileId].ownerPlayerName;
    }

    realignCardHands() {
        let mainArea, secondArea, thirdArea, forthArea;
        let idCounter = this.props.piles.find((pile) => {
            return pile.ownerPlayerName === this.props.userName;
        }).id;
        mainArea = idCounter;
        idCounter++;
        idCounter = this.checkUserOverFlow(idCounter);
        secondArea = idCounter;
        //this.setState({secondAreaPileId: idCounter});
        if (this.props.playersCapacity > 2) {
            idCounter++;
            idCounter = this.checkUserOverFlow(idCounter);
            thirdArea = idCounter;
            // this.setState({thirdAreaPileId: idCounter});

            if (this.props.playersCapacity > 3) {
                idCounter++;
                idCounter = this.checkUserOverFlow(idCounter);
                forthArea = idCounter;
                //this.setState({forthAreaPileId: idCounter});
            } else {
                forthArea = null;
                //this.setState({forthAreaPileId: null});
            }
        } else {
            thirdArea = null;
            forthArea = null;
            /*
                        this.setState({
                            thirdAreaPileId: null,
                            forthAreaPileId: null
                        });
            */
        }
        this.setState({
            mainAreaPileId: mainArea,
            secondAreaPileId: secondArea,
            thirdAreaPileId: thirdArea,
            forthAreaPileId: forthArea
        }, () => {
            // reveal the cards of the main player
            this.props.piles[this.state.mainAreaPileId].cards.forEach((item) => {
                item.isHidden = false;
            });

        });
    }

    moveCardDriver_1(cardId) {
        this.props.moveCardDriver(cardId);
    }

    checkUserOverFlow(userPileId) {
        if (userPileId > this.props.playersCapacity + 1) {
            userPileId = 2;
        }
        return userPileId;
    }

    updateDOMCoordinates() {
/*
        this.DOMCoordinates = {
            advancedBoardDOM: ReactDom.findDOMNode(this),
            drawPileDOM: ReactDom.findDOMNode(this).childNodes[1].childNodes[1].firstChild.firstChild.lastChild,
            discardPileDOM: ReactDom.findDOMNode(this).childNodes[1].childNodes[1].firstChild.childNodes[1].lastChild,
            mainAreaPileDOM: ReactDom.findDOMNode(this).lastChild.firstChild.lastChild,
            secondAreaPileDOM: ReactDom.findDOMNode(this).firstChild.childNodes[1].lastChild,
            thirdAreaPileDOM: ReactDom.findDOMNode(this).childNodes[1].firstChild.lastChild,
            forthAreaPileDOM: ReactDom.findDOMNode(this).childNodes[1].lastChild.lastChild,
        }
*/
    }
}

export default AdvancedBoard;


