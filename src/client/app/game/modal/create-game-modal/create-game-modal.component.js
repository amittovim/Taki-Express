import React, {Component} from 'react';
import './create-game-modal.component.css';
import ContentCard from "../../../shared/components/content-card/content-card.component";
// <PROPS>
// createGameSuccessHandler: function
// createGameErrorHandler  : function
// abortHandler             : function

export default class CreateGameModal extends Component {
    render() {
        return (
            <div className="create-game-modal-component">
                <ContentCard>
                    <h1> Creating new network TAKI game </h1>
                    <form onSubmit={this.handleCreateGame}>
                        <table>
                            <tbody>
                            <tr>
                                <td><label className="game-name-label" htmlFor="gameName"> Game name: </label></td>
                                <td><input className="game-name-input" type="text" placeholder="Game Name"
                                           name="gameName" /></td>
                            </tr>
                            <tr>
                                <td><label className="number-of-players-label" htmlFor="playersCapacity"> Number of
                                    players in
                                    game : </label></td>
                                <td><select className="number-of-players-input" name="playersCapacity">
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                </select>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <input type="checkbox" name="isBotEnabled" value="Bot Player enabled" />BOT Player
                                    enabled
                                </td>
                            </tr>
                            <tr>
                                <td><input className="submit-btn btn" type="submit" value="Create Game" /></td>
                                <td><input className="abort-btn btn" type="button" value="Cancel"
                                           onClick={this.handleAbortGameCreation} /></td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                    {this.renderErrorMessage()}
                </ContentCard>
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            errMessage: ''
        }

        this.handleCreateGame = this.handleCreateGame.bind(this);
        this.handleAbortGameCreation = this.handleAbortGameCreation.bind(this);
    }


    renderErrorMessage() {
        if (this.state.errMessage) {
            return (
                <div className="create-game-error-message">
                    {this.state.errMessage}
                </div>
            );
        }
        return null;
    }

    handleCreateGame(event) {
        event.preventDefault();
        const newGame = {};
        newGame.name = event.target.elements.gameName.value;
        newGame.playersCapacity = parseInt(event.target.elements.playersCapacity.value);
        event.target.elements.isBotEnabled.checked === true ? newGame.isBotEnabled = true : newGame.isBotEnabled = false;
        fetch('/lobby/games', {method: 'POST', body: JSON.stringify(newGame), credentials: 'include'})
            .then(response => {
                if (response.ok) {
                    this.setState(() => ({errMessage: ""}));
                    this.props.createGameSuccessHandler();
                } else {
                    if (response.status === 403) {
                        this.setState(() => ({errMessage: "game name already exist, please try another one"}));
                    }
                    this.props.createGameErrorHandler();
                }
            });
        return false;
    }

    handleAbortGameCreation() {
        this.props.abortHandler();
    }
}
