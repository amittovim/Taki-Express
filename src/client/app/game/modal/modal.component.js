import React, {Component} from 'react';
import ColorPickerModal from "./color-picker/color-picker.component";
import {ModalTypeEnum} from "./modal-type.enum";
import ModalFrame from "../../shared/components/modal/modal.component";
import AbortGameModal from "./abort-game/abort-game.component";
import StatisticsModal from "./statistics/statistics.component";
import GameOverModal from "./game-over-modal/game-over-modal.component";
import GameOverLoserModal from "./game-over-loser-modal/game-over-loser-modal.component";
import FirstPlaceWinnerModal from "./first-winner-modal/first-place-winner-modal.component";
import SecondPlaceWinnerModal from "./second-winner-modal/second-place-winner-modal.component";

// isOpen: boolean
// type: ModalTypeEnum
// callback: Function
// closeModal: Function
// restart: Function

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            subtitle: ''
        };
        this.renderSwitch = this.renderSwitch.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }

    render() {
        return (
            <ModalFrame isOpen={this.props.isOpen}
                        title={this.state.title}
                        subtitle={this.state.subtitle}>
                <div className="modal-component">
                    {this.renderSwitch(this.props.type)}
                </div>
            </ModalFrame>
        )
    }

    componentDidMount() {
        let title;
        let subtitle;
        switch (this.props.type) {
            case ModalTypeEnum.Welcome: {
                title = 'Welcome to the TAKI game!';
                subtitle = 'Let\'s start playing!';
                break;
            }
            default: {
                break;
            }
        }
        this.setState({
            title, subtitle
        })
    }

    renderSwitch(type) {
        switch (type) {
            case ModalTypeEnum.Welcome: {
                return (<WelcomeModal />);
            }
            case ModalTypeEnum.ColorPicker: {
                return (<ColorPickerModal onColorSelect={this.props.callback} />);
            }
            case ModalTypeEnum.AbortGame: {
                return (<AbortGameModal onSubmit={this.props.callback}
                                        onCancel={this.props.closeModal} />);
            }
            case ModalTypeEnum.Statistics: {
                return (<StatisticsModal {...this.props.data}
                                         onCancel={this.props.closeModal} />);
            }
            case ModalTypeEnum.GameOverLoser: {
                return (<GameOverLoserModal onSubmit={this.props.callback} />);
            }
            case ModalTypeEnum.FirstPlaceWinner: {
                return (<FirstPlaceWinnerModal onClick={this.props.handleClick} />);
            }
            case ModalTypeEnum.SecondPlaceWinner: {
                return (<SecondPlaceWinnerModal onClick={this.props.handleClick} />);
            }

            case ModalTypeEnum.default: {
                break;
            }
        }
    }

    handleClick(value) {
        this.props.callback(value);
    }
}

export default Modal;
