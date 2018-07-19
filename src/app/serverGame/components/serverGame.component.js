import React, {Component} from 'react';
import ModalFrame from "../../shared/components/modal/modal.component";
import Button from "../../shared/components/button/button.component";
import LoginModal from './login-modal.component';
import ChatContainer from './chat-container.component';
import UsersContainer from "./users-container.component";
import GamesContainer from "./games-container.component";
import CreateGameModal from "./create-game-modal.component";

export default class ServerGame extends Component {

    render(){
        if (this.state.showLogin) {
            return (
                <LoginModal loginSuccessHandler={this.handleSuccessfulLogin}
                            loginErrorHandler={this.handleErrorLogin} />
            );
        }
        else if (this.state.gameStarted){
            return this.renderGameRoom();
        }
        else if (this.state.isCreatingNewGame){
            return (
                <CreateGameModal createGameSuccessHandler={this.handleSuccessfulGameCreation}
                                 createGameErrorHandler={this.handleErrorGameCreation} />
            );
        }
        return this.renderLobbyRoom();

    }

    constructor(args) {
        super(...args);
        this.state = {
            showLogin: true,
            currentUser: {
                name: ''
            },
            gameStarted: false,
            chosenGame: '',
            isCreatingNewGame: false,
        };

        this.handleSuccessfulLogin  = this.handleSuccessfulLogin.bind(this);
        this.handleErrorLogin       = this.handleErrorLogin.bind(this);
        this.fetchUserInfo          = this.fetchUserInfo.bind(this);
        this.handleLogout           = this.handleLogout.bind(this);
        this.handleCreateNewGame    = this.handleCreateNewGame.bind(this);
        this.handleSuccessfulGameCreation = this.handleSuccessfulGameCreation.bind(this);
        this.handleErrorGameCreation= this.handleErrorGameCreation.bind(this);
        this.getUserName();
    }

    handleSuccessfulLogin() {
        this.setState( ()=> ({showLogin:false}),this.getUserName() );
    }

    handleErrorLogin(){
        console.error('login failed');
        this.setState( ()=> ({showLogin:true}));
    }

    renderLobbyRoom() {
        return (
            <div className='lobby-room-component'>
                <div className="user-info-area">
                    Hello {this.state.currentUser.name}
                    <Button className="logout btn" label={'Logout'} onClick={this.handleLogout} isDisabled={false} />
                </div>
                <Button className="create-new-game btn" label={'CREATE NEW GAME'} onClick={this.handleCreateNewGame} isDisabled={false} />
                <UsersContainer />
                <GamesContainer />
                <ChatContainer />
            </div>
        )
    }
    renderGameRoom(){
        return (
            <div className='game-room-component'>
                <GameRoom isBotEnabled = {true}
                    numberOfPlayersInGame = {2}
                    gameName = {'firstGame'}
                    numOfPlayersWaitingFor = {0} />
            </div>
        );
    }

    getUserName(){
    this.fetchUserInfo()
        .then(userInfo => {
            this.setState( ()=> ( {currentUser: userInfo, showLogin: false}));
        })
        .catch(err => {
            if (err.status === 401) { // in case we're getting 'unAuthorized' as response
                this.setState(()=>({showLogin: true}));
            } else {
                throw err; // in case we're getting an error
            }
        });
    }

    fetchUserInfo() {
        return fetch('/users',{method:'GET', credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            });
    }

    handleLogout() {
        fetch('/users/logout', {method:'GET', credentials:'include'})
            .then(response => {
                if (!response.ok) {
                    console.log(`'Failed to logout user ${this.state.currentUser.name} `, response)
                }
                this.setState(()=>({currentUser: {name:''}, showLogin: true}));
            })
    }

    handleCreateNewGame() {
        console.log(this.state);
        debugger;
        this.setState( () => ( {isCreatingNewGame: true } ));
    }

    handleSuccessfulGameCreation() {

    }

    handleErrorGameCreation() {

    }
}

