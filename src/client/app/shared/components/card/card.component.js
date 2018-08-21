import React, {Component} from 'react';
import './card.component.css'
import backImage from '../../../../assets/images/card-backside.jpeg';
import {CardActionEnum} from "../../../enums/card-action-enum";
import * as ReactDom from "react-dom";

// key: number
// card: card
// hoverEnabled: boolean
// Driver: function

class Card extends Component {

    render() {
        return (
            <div className={`card-component${this.props.hoverEnabled ? ' hover-enabled' : ''}`}
                 id={`card-${this.props.card.id}`}
                 onClick={this.handleClick}
                 style={
                     {
                         transform: `translate(${this.state.currentPositionX}px, ${this.state.currentPositionY}px)`,
                         transition: 'all 0.3s ease-in-out',
                         left: 0,
                         opacity: this.state.opacity
                     }
                 }>
                <img className={`${this.props.card.isHidden ? 'back-card-img' : 'front-card-img'}`}
                     src={this.imageSrc}
                     alt={this.display} />
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            currentPositionX: 0,
            currentPositionY: 0,
            opacity: 0
        };
        this.handleClick = this.handleClick.bind(this);
        this.animateCard = this.animateCard.bind(this);

    }

    componentDidMount() {
        setTimeout(() => this.setState({
            opacity: 0.25
        }), 1000);
        setTimeout(() => this.setState({
            opacity: 0.5
        }), 1000);
        setTimeout(() => this.setState({
            opacity: 0.75
        }), 1000);
        setTimeout(() => this.setState({
            opacity: 1
        }), 1000);

    }

    get display() {
        return this.props.card.action ? this.props.card.action : this.props.card.number;
    };

    get imageSrc() {
        return this.props.card.isHidden ? backImage : require(`../../../../assets/images/${this.fileName}`);
    }

    get fileName() {
        if (this.props.card.action === CardActionEnum.ChangeColor ||
            this.props.card.action === CardActionEnum.SuperTaki) {
            if (this.props.card.color === null) {
                return `${this.display}.jpg`;
            } else {
                return `${this.display}-${this.props.card.color}.jpg`;
            }
        } else {
            return `${this.display}-${this.props.card.color}.jpg`;
        }
    }

     animateCard(cardSourceDOM, cardDestinationDOM, callBackFunction, param1  ) {
        debugger;
        let oldX = cardSourceDOM.offsetLeft;
        let oldY = cardSourceDOM.offsetTop;
        let newX = cardDestinationDOM.offsetLeft;
        let newY = cardDestinationDOM.offsetTop;
        this.setState({
            currentPositionX: (this.state.currentPositionX - oldX + newX),
            currentPositionY: (this.state.currentPositionY - oldY + newY)
        }, () => {
            debugger;
            callBackFunction(param1);
        });

    }

    handleClick() {
        const cardSourceDOM = ReactDom.findDOMNode(this);
        const cardDestinationDOM = ReactDom.findDOMNode(this).parentNode.parentNode.parentNode.childNodes[1].childNodes[1].firstChild.firstChild.lastChild;

        this.animateCard(cardSourceDOM, cardDestinationDOM ,this.props.moveCardDriver2, this.props.card.id);

/*          // version1 ***************************************************
        debugger;
        const cardSourceDOM = ReactDom.findDOMNode(this);
        const cardDestinationDOM = ReactDom.findDOMNode(this).parentNode.parentNode.parentNode.childNodes[1].childNodes[1].firstChild.firstChild.lastChild;
        let oldX = cardSourceDOM.offsetLeft;
        let oldY = cardSourceDOM.offsetTop;
        let newX = cardDestinationDOM.offsetLeft;
        let newY = cardDestinationDOM.offsetTop;

        this.setState({
            currentPositionX: (this.state.currentPositionX - oldX + newX),
            currentPositionY: (this.state.currentPositionY - oldY + newY)
        }, () => {
            debugger;
            this.props.moveCardDriver2(this.props.card.id);
        });
*///************************************************************************

        this.props.moveCardDriver2(this.props.card.id);
    };
}

export default Card;
