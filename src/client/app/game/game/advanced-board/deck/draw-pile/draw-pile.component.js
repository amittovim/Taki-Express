import React, {Component} from 'react';
import './draw-pile.component.css';
import Card from "../../../../../shared/components/card/card.component";
import {DEBBUG_MODE} from "../../../../../../../server/logic/consts";

// drawPile: Pile

class DrawPile extends Component {
    constructor(props) {
        super(props);

        this.state = {}

        this.moveCardDriver2 = this.moveCardDriver2.bind(this);

    }

    render() {
        return (
            <div className={`draw-pile-component ${this.isPlayersTurn ? 'clickable-pile' : ''}`}>
                {
                    this.props.drawPile.cards.map((card, index) => {
                        return <Card isHidden={!DEBBUG_MODE}
                                     key={card.id}
                                     card={card}
                                     hoverEnabled={index === this.props.drawPile.cards.length - 1}
                                     moveCardDriver2={this.moveCardDriver2}
                        />
                    })
                }
            </div>
        );
    }

    moveCardDriver2(card) {
        this.props.moveCardDriver1(card, this.props.drawPile);
    };

    get isPlayersTurn() {
        return this.props.currentPlayerName === this.props.myPlayerName;
    }
}

export default DrawPile;
