import React, {Component} from 'react';
import './hand.component.css';
import Card from "../../../../shared/components/card/card.component";
import {PlayerEnum} from "../../../../enums/player.enum";

// owner: PlayerEnum
// pile: Pile
// moveCardDriver1
// DOMCoordinates
// XYCoordinates : object
// selectedCard : Card Object
class Hand extends Component {

    render() {
        return (
            <div className="hand-component">
                {
                    this.props.pile
                        ? (<h1>{this.props.pile.ownerPlayerName}</h1>)
                        : null
                }
                {
                    this.props.pile
                        ? (
                            this.props.pile.cards.map((card) => {
                                return (
                                    <Card key={card.id}
                                          card={card}
                                          hoverEnabled={true}
                                          moveCardDriver2={this.moveCardDriver2}
                                          DOMCoordinates={this.props.DOMCoordinates}
                                          XYCoordinates={ (card === this.props.selectedCard)
                                              ? this.props.XYCoordinates
                                              : {x:5,y:5} }
                                          animateCard={this.animateCard}
                                          selectedCard={ this.props.selectedCard}
                                    />)
                            }))
                        : null
                }
            </div>
        )
    }

    constructor(props) {
        super(props);
        this.state = {}
        this.moveCardDriver2 = this.moveCardDriver2.bind(this);
    }

    moveCardDriver2(cardId) {
        this.props.moveCardDriver1(cardId);
    }

    componentWillReceiveProps(props) {
        debugger;
    }

    animateCard(){
        this.setState({
            x: 100,
            y: 100
        });

    }
}

export default Hand;
