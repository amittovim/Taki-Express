import React, {Component} from 'react';
import './card.component.css'
import {CardActionEnum} from "../../../enums/card-action-enum";
import * as ReactDom from "react-dom";

// key: number
// card: card
// hoverEnabled: boolean
// Driver: function
// isHidden: boolean

class Card extends Component {

    render() {
        return (
            <div className={`card-component${this.props.hoverEnabled ? ' hover-enabled' : ''}`}
                 id={`card-${this.props.card.id}`}
                 onClick={this.handleClick}
                 style={
                     {
                         transition: 'all 0.3s ease-in-out',
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

    handleClick() {
        this.props.moveCardDriver2(this.props.card.id);
    };
}

export default Card;
