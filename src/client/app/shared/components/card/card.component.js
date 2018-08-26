import React, {Component} from 'react';
import './card.component.css'
import {CardActionEnum} from "../../../enums/card-action-enum";
import * as ReactDom from "react-dom";

// key: number
// card: card
// hoverEnabled: boolean
// Driver: function
// isHidden: boolean
// animateCardInfo: Object
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
                <img src={this.imageSrc}
                     alt={this.display} />
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            currentPositionX:0,
            currentPositionY:0,
            opacity: 0
        };
        this.handleClick = this.handleClick.bind(this);
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

    componentDidUpdate(prevProps, prevState){
        if ( this.props.animateCardInfo && this.props.animateCardInfo.testing === 'testing' &&
            prevProps.animateCardInfo !== this.props.animateCardInfo ) {
            debugger;
            if (this.props.animateCardInfo.sourceDOM && this.props.animateCardInfo.destinationDOM) {
                this.animateCard(this.props.animateCardInfo.sourceDOM, this.props.animateCardInfo.destinationDOM);
            }
        }

    }

    componentWillReceiveProps(props) {

    }

    componentWillUnmount() {
        setTimeout(() => this.setState({
            opacity: 1
        }), 1000);
        setTimeout(() => this.setState({
            opacity: 0.75
        }), 1000);
        setTimeout(() => this.setState({
            opacity: 0.5
        }), 1000);
        setTimeout(() => this.setState({
            opacity: 0.25
        }), 1000);
    }

    get display() {
        return this.props.card.action ? this.props.card.action : this.props.card.number;
    };

    get imageSrc() {
        return this.props.isHidden
            ? require('../../../../assets/images/card-backside.jpeg')
            : require(`../../../../assets/images/${this.fileName}`);
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

    animateCard(cardSourceDOM, cardDestinationDOM) {
        debugger;
        let oldX = cardSourceDOM.offsetLeft;
        let oldY = cardSourceDOM.offsetTop;
        let newX = cardDestinationDOM.offsetLeft;
        let newY = cardDestinationDOM.offsetTop;
        this.setState({
            currentPositionX: (-oldX ),
            currentPositionY: (-oldY )
        }, () => {
            debugger;
        });
    }

    animateCard2(cardSourceDOM, cardDestinationDOM) {
        debugger;
        let oldX = cardSourceDOM.offsetLeft;
        let oldY = cardSourceDOM.offsetTop;
        let newX = cardDestinationDOM.offsetLeft;
        let newY = cardDestinationDOM.offsetTop;
        this.setState({
            currentPositionX: (-oldX + newX),
            currentPositionY: (-oldY + newY)
        }, () => {
            debugger;
        });
    }

    handleClick() {
        const cardSourceDOM = ReactDom.findDOMNode(this);
        var elements = document.getElementsByClassName ("discard-pile-component")
        const cardDestinationDOM = ReactDom.findDOMNode(elements[0]).lastChild;
        this.animateCard2(cardSourceDOM, cardDestinationDOM);
        this.props.moveCardDriver2(this.props.card.id);
    };
}

export default Card;
