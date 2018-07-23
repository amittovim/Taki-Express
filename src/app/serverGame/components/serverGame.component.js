import React, {Component} from 'react';
import ModalFrame from "../../shared/components/modal/modal.component";
import Button from "../../shared/components/button/button.component";
import LoginModal from './login-modal.component';
import ChatContainer from './chat-container.component';
import UsersContainer from "./users-container.component";
import GamesContainer from "./games-container.component";
import CreateGameModal from "./create-game-modal.component";
import {ViewsEnum} from "../../enums/views-enum";
import Game from "../../game/game.component";

export default class ServerGame extends Component {

    render() {
        switch (this.state.activeView) {
            case ViewsEnum.Login: {
                return (
                    <LoginModal loginSuccessHandler={this.handleSuccessfulLogin}
                                loginErrorHandler={this.handleErrorLogin}/>
                );
            }
            case ViewsEnum.Lobby: {
                return this.renderLobbyRoom();
            }
            case ViewsEnum.GameCreation: {
                return (<CreateGameModal createGameSuccessHandler={this.handleSuccessfulGameCreation}
                                         createGameErrorHandler={this.handleErrorGameCreation}
                                         abortHandler={this.handleAbortGameCreation}/>
                );
            }
            case ViewsEnum.Game: {
                return this.renderGameRoom();
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
        this.getUserName();
    }

    handleSuccessfulLogin() {
        this.setState(() => ({activeView: ViewsEnum.Lobby}), this.getUserName());
    }

    handleErrorLogin() {
        console.error('login failed');
        this.setState(() => ({activeView: ViewsEnum.Login}));
    }

    renderLobbyRoom() {
        return (
            <div className='lobby-room-component'>
                <div className="user-info-area">
                    Hello {this.state.currentUser.name}
                    <Button className="logout btn" label={'Logout'} onClick={this.handleLogout} isDisabled={false}/>
                </div>
                <Button className="create-new-game btn" label={'CREATE NEW GAME'} onClick={this.handleCreateNewGame}
                        isDisabled={false}/>
                <UsersContainer/>
                <GamesContainer successfulGameChoosingHandler={this.handleSuccessfulGameChoosing}/>

                <ChatContainer/>
            </div>
        )
    }

    renderGameRoom() {
        return (
            <div className='game-room-component'>
                <Game chosenGame={this.state.currentGame}
                      isBotEnabled={true}
                      numberOfPlayersInGame={2}
                      gameName={'firstGame'}
                      numOfPlayersWaitingFor={0}/>
            </div>
        );
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
                    console.log(res.json);
                    this.setState(() => ({
                        currentGame: '1',
                        activeView: ViewsEnum.Game
                    }));
                }
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

