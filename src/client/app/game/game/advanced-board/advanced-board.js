import React, {Component} from 'react';
import './advanced-board.css';
import Hand from "../advanced-board/hand/hand.component";
import {PlayerEnum} from "../../../enums/player.enum";
import Deck from "../advanced-board/deck/deck.component";
import {PileIdEnum} from "../../../enums/pile-id.enum";
import {DEBBUG_MODE} from "../../../../../server/logic/consts";
import * as ReactDom from "react-dom";
import * as Enums from "../../../../../server/enums-node";

// <PROPS>
// piles: Pile[]
// userName: string
// playersCapacity: Number
// currentPlayerName: string
// animateCardInfo : Object
class AdvancedBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainAreaPileId: null,
            secondAreaPileId: null,
            thirdAreaPileId: null,
            forthAreaPileId: null,
        };
        this.animateCardInfo = {};
        // this.getCurrentUserPile = this.getCurrentUserPile.bind(this);
        this.moveCardDriver_1 = this.moveCardDriver_1.bind(this);
        this.checkUserOverFlow = this.checkUserOverFlow.bind(this);
    }

    render() {
        return (
            <div className="advanced-board-component">
                <div className='top-board'>
                    <div className='empty-space'></div>
                    <Hand openHand={DEBBUG_MODE || false}
                          currentPlayerName={this.props.currentPlayerName}
                          owner={this.props.piles[this.state.secondAreaPileId].ownerPlayerName}
                          pile={this.props.piles[this.state.secondAreaPileId]}
                          moveCardDriver1={this.moveCardDriver_1}
                          animateCardInfo={
                              (this.props.animateCardInfo)
                                  ? (this.props.animateCardInfo.sourcePileId === this.state.secondAreaPileId)
                                  || (this.props.animateCardInfo.destinationPileId === this.state.secondAreaPileId)
                                  ?  (this.animateCardInfo)
                                  : null
                                  : null}
                    />
                    <div className='empty-space'></div>
                </div>
                <div className='middle-board'>
                    <div className='left-section'>
                        {(!this.state.thirdAreaPileId)
                            ? (null)
                            : (<Hand openHand={DEBBUG_MODE || false}
                                     currentPlayerName={this.props.currentPlayerName}
                                     owner={this.props.piles[this.state.thirdAreaPileId].ownerPlayerName}
                                     pile={this.props.piles[this.state.thirdAreaPileId]}
                                     moveCardDriver1={this.moveCardDriver_1}
                                     animateCardInfo={
                                         (this.props.animateCardInfo)
                                             ? (this.props.animateCardInfo.sourcePileId === this.state.thirdAreaPileId)
                                             || (this.props.animateCardInfo.destinationPileId === this.state.thirdAreaPileId)
                                             ?  (this.animateCardInfo)
                                             : null
                                             : null}
                            />)}
                    </div>
                    <div className='center-section'>
                        <Deck currentPlayerName={this.props.currentPlayerName}
                              myPlayerName={this.props.piles[this.state.mainAreaPileId].ownerPlayerName}
                              drawPile={this.props.piles[PileIdEnum.DrawPile]}
                              discardPile={this.props.piles[PileIdEnum.DiscardPile]}
                              moveCardDriver0={this.moveCardDriver_1}


                        />
                    </div>
                    <div className='right-section'>
                        {(!this.state.forthAreaPileId)
                            ? (null)
                            : (<Hand openHand={DEBBUG_MODE || false}
                                     currentPlayerName={this.props.currentPlayerName}
                                     owner={this.props.piles[this.state.forthAreaPileId].ownerPlayerName}
                                     pile={this.props.piles[this.state.forthAreaPileId]}
                                     moveCardDriver1={this.moveCardDriver_1}
                                     animateCardInfo={
                                         (this.props.animateCardInfo)
                                             ? (this.props.animateCardInfo.sourcePileId === this.state.forthAreaPileId)
                                             || (this.props.animateCardInfo.destinationPileId === this.state.forthAreaPileId)
                                             ?  (this.animateCardInfo)
                                             : null
                                             : null}

                            />)}
                    </div>
                </div>
                <div className={`bottom-board ${this.props.currentPlayerName === this.player ? 'players-turn' : ''}`}>
                    <Hand openHand={DEBBUG_MODE || true}
                          currentPlayerName={this.props.currentPlayerName}
                          owner={this.props.piles[this.state.mainAreaPileId].ownerPlayerName}
                          pile={this.props.piles[this.state.mainAreaPileId]}
                          moveCardDriver1={this.moveCardDriver_1}
                          animateCardInfo={
                              (this.props.animateCardInfo)
                                  ? (this.props.animateCardInfo.sourcePileId === this.state.mainAreaPileId)
                                  || (this.props.animateCardInfo.destinationPileId === this.state.mainAreaPileId)
                                    ?  (this.animateCardInfo)
                                    : null
                                  : null}

                    />
                </div>
            </div>
        );
    }

    componentWillMount() {
        this.realignCardHands();
    }

    componentDidUpdate(prevProps, prevState){
        if (this.props.animateCardInfo && prevProps.animateCardInfo !==this.props.animateCardInfo) {
            debugger;
            let animateCardInfo = this.props.animateCardInfo;
            animateCardInfo.destinationDOMClassName = this.findDesignatedAreaClassNameForPileId(animateCardInfo.destinationPileId);
            let element = document.getElementsByClassName(animateCardInfo.destinationDOMClassName)[0];
            let element2 = element.getElementsByClassName('hand-component')[0];
            animateCardInfo.destinationDOM =
                ReactDom.findDOMNode(element2).firstChild.childNodes[1].lastChild;
            animateCardInfo.sourceDOM =
                ReactDom.findDOMNode(document.getElementById('card-' + animateCardInfo.cardToMove.id));
            this.animateCardInfo = animateCardInfo;
        }
        //animateCardInfo.sourceDOMClassName = this.findDesignatedAreaClassNameForPileId(animateCardInfo.sourcePileId);
        // .getBoundingClientRect();

    }

    get player() {
        return this.props.piles[this.state.mainAreaPileId].ownerPlayerName;
    }

    findDesignatedAreaClassNameForPileId(pileID ) {

        switch (pileID) {
            case Enums.PileIdEnum.DrawPile: {
                return 'draw-pile';
            }
            case Enums.PileIdEnum.DiscardPile: {
                return 'discard-pile';
            }
            case this.state.mainAreaPileId: {
                return 'bottom-board';
            }
            case this.state.secondAreaPileId: {
                return 'top-board';
            }
            case this.state.thirdAreaPileId: {
                return 'left-section';
            }
            case this.state.forthAreaPileId: {
                return 'right-section';
            }
            default: {
                return '';
            }
        }
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

}

export default AdvancedBoard;


