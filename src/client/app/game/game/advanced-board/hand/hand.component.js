import React, {Component} from 'react';
import './hand.component.css';
import Card from "../../../../shared/components/card/card.component";
import {PlayerEnum} from "../../../../enums/player.enum";

// currentPlayer: string
// owner: string
// pile: Pile
// moveCardDriver1

class Hand extends Component {

    render() {
        return (
            <div className="hand-component">
                {
                    this.props.pile
                        ? (
                            <div className={'cont'}>
                                <span>{this.props.pile.ownerPlayerName}</span>
                                <div className={'cards'}>
                                    {
                                        this.props.pile.cards.map((card) => {
                                            return (
                                                <Card isHidden={!this.props.openHand}
                                                      key={card.id}
                                                      card={card}
                                                      hoverEnabled={true}
                                                      moveCardDriver2={this.moveCardDriver2}
                                                />)
                                        })
                                    }
                                </div>
                            </div>
                        )
                        : null
                }
            </div>
        )
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.moveCardDriver2 = this.moveCardDriver2.bind(this);
    }

    moveCardDriver2(cardId) {
        this.props.moveCardDriver1(cardId);
    }
}

export default Hand;
