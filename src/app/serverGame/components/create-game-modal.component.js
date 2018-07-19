import React, {Component} from 'react';
import './create-game-modal.component.css';
// <PROPS>
// createGameSuccessHandler: function
// createGameErrorHandler  : function
// abortHandler             : function

export default class CreateGameModal extends Component {
    render() {
        return (
            <div className="create-game-modal-component">
                <h1> Creating new network TAKI game </h1>
                <form onSubmit={this.handleCreateGame}>
                    <table>
                        <tbody>
                        <tr>
                            <td> <label className="game-name-label" htmlFor="gameName"> Game name: </label> </td>
                            <td> <input className="game-name-input" type="text" placeholder="Game Name" name="gameName"/></td>
                        </tr>
                        <tr>
                            <td> <label className="number-of-players-label" htmlFor="numOfPLayers"> Number of players in game : </label> </td>
                            <td> <select className="number-of-players-input" name="numOfPLayers">
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td> <label className="bot-player-enabled-label" htmlFor="botPlayerEnabled"> Enable BOT player in game ? </label> </td>
                            <td>
                                <input className="bot-player-enabled-input" type="radio" name="isBotPlayerEnabled" value="Yes"/>Yes
                                <input className="bot-player-enabled-input" type="radio" name="isBotPlayerEnabled" value="No"/>No
                            </td>
                        </tr>
                        <tr>
                            <td> <input className="submit-btn btn" type="submit" value="Create Game"/> </td>
                            <td> <input className="abort-btn btn" type="button" value="Cancel" onClick="handleAbort()"/> </td>
                        </tr>
                    </tbody>
                    </table>
                </form>
                {this.renderErrorMessage()}
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state ={
            errMessage: ''
        }

        this.handleCreateGame = this.handleCreateGame.bind(this);
        this.handleAbort = this.handleAbort.bind(this);
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
        const game = {} ;
        game.name               = event.target.elements.gameName.value;
        game.numOfPLayers       = event.target.elements.numOfPLayers.value;
        game.isBotPlayerEnabled = event.target.elements.isBotPlayerEnabled.value;

        fetch('/lobby/Games', {method:'POST', body: game, credentials: 'include'})
            .then(response=> {
                if (response.ok){
                    this.setState(()=> ({errMessage: ""}));
                    this.props.createGameSuccessHandler();
                } else {
                    if (response.status === 403) {
                        this.setState(()=> ({errMessage: "User name already exist, please try another one"}));
                    }
                    this.props.createGameErrorHandler();
                }
            });
        return false;
    }

    handleAbort() {
        this.props.abortHandler();
    }
}