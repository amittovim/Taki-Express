import React, {Component} from 'react';
import './advanced-board.css';
import Hand from "../advanced-board/hand/hand.component";
import {PlayerEnum} from "../../../enums/player.enum";
import Deck from "../advanced-board/deck/deck.component";
import {PileIdEnum} from "../../../enums/pile-id.enum";

// <PROPS>
// piles: Pile[]
// userId: string

class AdvancedBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        // this.getCurrentUserPile = this.getCurrentUserPile.bind(this);
        this.moveCardDriver_1 = this.moveCardDriver_1.bind(this);
    }

    render() {
        return (
            <div className="advanced-board-component">
                <div className='top-board'>
                    <div className='empty-space'></div>
                    <Hand owner={PlayerEnum.Bot}
                          pile={this.props.piles[3]}
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
                    <Hand owner={PlayerEnum.Bot}
                          pile={this.props.piles[2]}
                          moveCardDriver1={this.moveCardDriver_1}
                    />
                </div>
            </div>
        );
    }

    // getCurrentUserPile() {
    //     return this.props.piles.find(pile => pile.ownerPlayerName === this.props.userId);
    // }

    moveCardDriver_1(cardId) {
        this.props.moveCardDriver(cardId);
    }
}

export default AdvancedBoard;

