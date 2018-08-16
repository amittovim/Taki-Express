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
        this.state = {
            mainAreaPileId: null,
            secondAreaPileId: null,
            thirdAreaPileId: null,
            forthAreaPileId: null,
        };


        // this.getCurrentUserPile = this.getCurrentUserPile.bind(this);
        this.moveCardDriver_1 = this.moveCardDriver_1.bind(this);
        this.checkUserOverFlow = this.checkUserOverFlow.bind(this);
    }

    render() {
        this.func();
        return (
            <div className="advanced-board-component">
                <div className='top-board'>
                    <div className='empty-space'></div>
                    <Hand owner={this.props.piles[this.state.secondAreaPileId].ownerPlayerName}
                          pile={this.props.piles[this.state.secondAreaPileId]}
                          moveCardDriver1={this.moveCardDriver_1}
                    />
                    <div className='empty-space'></div>
                </div>
                <div className='middle-board'>
                    <div className='left-section'>
                        <Hand owner={this.props.piles[this.state.thirdAreaPileId].ownerPlayerName}
                              pile={this.props.piles[this.state.thirdAreaPileId]}
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
                        <Hand owner={this.props.piles[this.state.forthAreaPileId].ownerPlayerName}
                              pile={this.props.piles[this.state.forthAreaPileId]}
                              moveCardDriver1={this.moveCardDriver_1}
                        />
                    </div>
                </div>
                <div className='bottom-board'>
                    <Hand owner={this.props.piles[this.state.mainAreaPileId].ownerPlayerName}
                          pile={this.props.piles[this.state.mainAreaPileId]}
                          moveCardDriver1={this.moveCardDriver_1}
                    />
                </div>
            </div>
        );
    }

    func() {
        debugger;
        let idCounter = this.props.piles.find((pile) => {
            return pile.ownerPlayerName === this.props.userName;
        }).id;
        this.setState({mainAreaPileId: idCounter});
        idCounter++;
        idCounter = this.checkUserOverFlow(idCounter);
        this.setState({secondAreaPileId: idCounter});
        if (this.props.playersCapacity > 2) {
            idCounter++;
            idCounter = this.checkUserOverFlow(idCounter);
            this.setState({thirdAreaPileId: idCounter});

            if (this.props.playersCapacity > 3) {
                idCounter++;
                idCounter = this.checkUserOverFlow(idCounter);
                this.setState({forthAreaPileId: idCounter});
            } else {
                this.setState({forthAreaPileId: null});
            }
        } else {
            this.setState({
                thirdAreaPileId: null,
                forthAreaPileId: null
            });
        }

        // reveal the cards of the main player
        this.props.piles[this.state.mainAreaPileId].cards.forEach((item) => {
            item.isHidden = false;
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


