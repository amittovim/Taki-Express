import React, {Component} from 'react';
import './advanced-board.css';
import Hand from "../board/hand/hand.component";
import {PlayerEnum} from "../../enums/player.enum";
import Deck from "../board/deck/deck.component";

class AdvancedBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        return (
            <div className="advanced-board-component">
                <div className='top-board'>
                    <div className='empty-space'></div>
                    <Hand owner={PlayerEnum.Bot}
                          pile={this.props.botPile}
                    />
                    <div className='empty-space'></div>
                </div>
                <div className='middle-board'>
                    <div className='left-section'>
                        <Hand owner={PlayerEnum.Bot}
                              pile={this.props.botPile}
                        />
                    </div>
                    <div className='center-section'>
                        <Deck drawPile={this.props.drawPile}
                              discardPile={this.props.discardPile}
                              moveCardDriver0={this.moveCardDriver_1}

                        />
                    </div>
                    <div className='right-section'>
                        <Hand owner={PlayerEnum.Bot}
                              pile={this.props.botPile}
                        />
                    </div>
                </div>
                <div className='bottom-board'>
                    <Hand owner={PlayerEnum.Bot}
                          pile={this.props.botPile}
                    />
                </div>
            </div>
        );
    }
}

export default AdvancedBoard;
