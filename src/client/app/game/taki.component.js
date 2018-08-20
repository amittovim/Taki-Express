import React, {Component} from 'react';
import CreateGameModal from "./modal/create-game-modal/create-game-modal.component";
import {ViewsEnum} from "../enums/views-enum";
import LoginModal from "./login/login.component";
import Game from "./game/game.component";
import Lobby from "./lobby/lobby.component";

export default class Taki extends Component {

    render() {
        switch (this.state.activeView) {
            case ViewsEnum.Login: {
                return (
                    <LoginModal loginSuccessHandler={this.handleSuccessfulLogin}
                                loginErrorHandler={this.handleErrorLogin} />
                );
            }
            case ViewsEnum.Lobby: {
                return (
                    <Lobby username={this.state.currentUser.name}
                           handleCreateNewGame={this.handleCreateNewGame}
                           handleSuccessfulGameChoosing={this.handleSuccessfulGameChoosing}
                           handleLogout={this.handleLogout} />
                );
            }
            case ViewsEnum.GameCreation: {
                return (<CreateGameModal createGameSuccessHandler={this.handleSuccessfulGameCreation}
                                         createGameErrorHandler={this.handleErrorGameCreation}
                                         abortHandler={this.handleAbortGameCreation} />
                );
            }
            case ViewsEnum.Game: {
                return (<Game game={this.state.currentGame}
                              userId={this.state.currentUser.name}
                              handleSuccessfulGameLeaving = {this.handleSuccessfulGameLeaving}
                              endGameHandler={this.handleEndingOfGame} />
                );
            }
        }
    }

    constructor(args) {
        super(...args);
        this.state = {
            currentUser: {
                name: ''
            },
            activeView: ViewsEnum.Login,
            currentGame: null,
        };

        this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
        this.handleErrorLogin = this.handleErrorLogin.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleCreateNewGame = this.handleCreateNewGame.bind(this);
        this.handleSuccessfulGameCreation = this.handleSuccessfulGameCreation.bind(this);
        this.handleErrorGameCreation = this.handleErrorGameCreation.bind(this);
        this.handleAbortGameCreation = this.handleAbortGameCreation.bind(this);
        this.handleSuccessfulGameChoosing = this.handleSuccessfulGameChoosing.bind(this);
        this.handleEndingOfGame = this.handleEndingOfGame.bind(this);
        this.handleSuccessfulGameLeaving = this.handleSuccessfulGameLeaving.bind(this);

        this.getUserName();
    }

    componentDidUpdate() {
    }

    handleSuccessfulLogin() {
        this.setState(() => ({activeView: ViewsEnum.Lobby}), this.getUserName());
    }

    handleErrorLogin() {
        console.error('login failed');
        this.setState(() => ({activeView: ViewsEnum.Login}));
    }

    getUserName() {
        this.fetchUserInfo()
            .then(userInfo => {
                this.setState(() => ({currentUser: userInfo, activeView: ViewsEnum.Lobby}));
            })
            .catch(err => {
                if (err.status === 401) { // in case we're getting 'unAuthorized' as response
                    this.setState(() => ({activeView: ViewsEnum.Login}));
                } else {
                    throw err; // in case we're getting an error
                }
            });
    }

    fetchUserInfo() {
        return fetch('/users', {method: 'GET', credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    console.log(`'Failed to retrieve user information !`);
                    throw response;
                }
                return response.json();
            });
    }

    handleLogout() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    console.log(`Failed to logout user ${this.state.currentUser.name}. response content is : `, response)
                }
                this.setState(() => ({currentUser: {name: ''}, activeView: ViewsEnum.Login}));
            })
    }

    handleCreateNewGame() {
        this.setState(() => ({activeView: ViewsEnum.GameCreation}));
    }

    handleAbortGameCreation() {
        this.setState(() => ({activeView: ViewsEnum.Lobby}));
    }

    handleSuccessfulGameCreation() {
        this.setState(() => ({activeView: ViewsEnum.Lobby}));

    }

    handleErrorGameCreation() {

    }

    handleSuccessfulGameChoosing(game) {
        const data = {
            user: this.state.currentUser.name,
            game
        };
        fetch('/lobby/games', {
            method: 'PUT', body: JSON.stringify(data), credentials: 'include'
        })
            .then(res => {
                if (!res.ok) {
                    console.log(`'Failed to register ${this.state.currentUser.name} to the game named ${game.name} ! response content is: `, response);
                }
                else {
                    return res.json();
                }
            })
            .then(content => {
                this.setState(() => ({
                    activeView: ViewsEnum.Game,
                    currentGame: content.currentGame,

                }));
            })
            .catch(err => {
                if (err.status === 401) { // in case we're getting 'unAuthorized' as response
                    this.setState(() => ({activeView: ViewsEnum.Login}));
                } else {
                    throw err; // in case we're getting an error
                }
            });
    }

    handleEndingOfGame() {
        this.setState(() => ({
            activeView: ViewsEnum.Lobby,
        }));

    }

    handleSuccessfulGameLeaving(game) {
        const data = {
            user: this.state.currentUser.name,
            game
        };
        fetch('/lobby/games/leaving/', {
            method: 'PUT', body: JSON.stringify(data), credentials: 'include'
        })
            .then(res => {
                if (!res.ok) {
                    console.log(`'Failed to unregister ${this.state.currentUser.name} to the game named ${game.name} ! response content is: `, response);
                }
                else {
                    return res.json();
                }
            })
            .then(content => {

                this.setState(() => ({
                    activeView: ViewsEnum.Lobby,
                    currentGame: content.currentGame,

                }));
            })
            .catch(err => {
                if (err.status === 401) { // in case we're getting 'unAuthorized' as response
                    this.setState(() => ({activeView: ViewsEnum.Login}));
                } else {
                    throw err; // in case we're getting an error
                }
            });
    }

}

