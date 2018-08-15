import React, {Component} from 'react';
import './advanced-board.css';
import Hand from "../advanced-board/hand/hand.component";
import {PlayerEnum} from "../../../enums/player.enum";
import Deck from "../advanced-board/deck/deck.component";
import {PileIdEnum} from "../../../enums/pile-id.enum";

// <PROPS>
// piles: Pile[]
// userName: string
// playersCapacity: Number

class AdvancedBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // this.getCurrentUserPile = this.getCurrentUserPile.bind(this);
        this.moveCardDriver_1 = this.moveCardDriver_1.bind(this);
        this.checkUserOverFlow = this.checkUserOverFlow.bind(this);
    }

    render() {
        debugger;
        let userPileId = this.props.piles.find((pile) => {
            return pile.ownerPlayerName === this.props.userName;
        }).id;
        debugger;
        let mainPlayerAreaPileId = userPileId;

        let secondPlayerAreaPileId, thirdPlayerAreaPileId, forthPlayerAreaPileId;
        userPileId++;
        userPileId = this.checkUserOverFlow(userPileId);
        secondPlayerAreaPileId = userPileId++;
        if (this.props.playersCapacity > 2) {
            thirdPlayerAreaPileId = userPileId = this.checkUserOverFlow(userPileId++);
            if (this.props.playersCapacity > 3) {
                forthPlayerAreaPileId = userPileId = this.checkUserOverFlow(userPileId++);
            } else {
                forthPlayerAreaPileId = null;
            }
        } else {
            thirdPlayerAreaPileId = null;
            forthPlayerAreaPileId = null;
        }

        // reveal the cards of the main player
        this.props.piles[mainPlayerAreaPileId].cards.forEach( (item) => { item.isHidden=false; });

        return (
            <div className="advanced-board-component">
                <div className='top-board'>
                    <div className='empty-space'></div>
                    <Hand owner={this.props.piles[secondPlayerAreaPileId].ownerPlayerName}
                          pile={this.props.piles[secondPlayerAreaPileId]}
                          moveCardDriver1={this.moveCardDriver_1}
                    />
                    <div className='empty-space'></div>
                </div>
                <div className='middle-board'>
                    <div className='left-section'>
                        <Hand owner={PlayerEnum.Bot}
                              pile={this.props.piles[4]}
                              moveCardDriver1={this.moveCardDriver_1}
                        />
                    </div>
                    <div className='center-section'>
                        <Deck drawPile={this.props.piles[PileIdEnum.DrawPile]}
                              discardPile={this.props.piles[PileIdEnum.DiscardPile]}
                              moveCardDriver0={this.moveCardDriver_1}

                        />
                    </div>
                    <div className='right-section'>
                        <Hand owner={PlayerEnum.Bot}
                              pile={this.props.piles[5]}
                              moveCardDriver1={this.moveCardDriver_1}
                        />
                    </div>
                </div>
                <div className='bottom-board'>
                    <Hand owner={this.props.piles[mainPlayerAreaPileId].ownerPlayerName}
                          pile={this.props.piles[mainPlayerAreaPileId]}
                          moveCardDriver1={this.moveCardDriver_1}
                    />
                </div>
            </div>
        );
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


