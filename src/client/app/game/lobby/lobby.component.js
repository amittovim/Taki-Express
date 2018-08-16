import React, {Component} from 'react';
import './lobby.component.css';
import Button from "../../shared/components/button/button.component";
import UsersContainer from "./components/user-list/users-container.component";
import GamesContainer from "./components/game-list/games-container.component";
import Navbar from "../navbar/navbar.component";
import NewNavbar from "../new-navbar/new-navbar.component";
import GameList from "./components/game-list/game-list.component";
import LobbyDashboard from "./components/lobby-dashboard/lobby-dashboard.component";
import ContentCard from "../../shared/components/content-card/content-card.component";
import ChatContainer from "../game/chat/chat-container.component";

// <PROPS>
// username: string;

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.handleCreateNewGame = this.handleCreateNewGame.bind(this);
        this.handleSuccessfulGameChoosing = this.handleSuccessfulGameChoosing.bind(this);
    }

    render() {
        return (
            <div className="lobby-component">
                <NewNavbar username={this.props.username} />
                <LobbyDashboard />
                <div className="cards-container">
                    <ContentCard>
                        <UsersContainer />
                    </ContentCard>
                    <ContentCard>
                        <GamesContainer successfulGameChoosingHandler={this.handleSuccessfulGameChoosing} />
                        <div className="new-game-button">
                            <Button label={'CREATE NEW GAME'}
                                    onClick={this.handleCreateNewGame}
                                    isDisabled={false} />
                        </div>
                    </ContentCard>
                </div>
                {/*<ChatContainer message={''} />*/}
            </div>
        );
    }

    handleCreateNewGame() {
        this.props.handleCreateNewGame();
    }

    handleSuccessfulGameChoosing(game) {
        const data = {
            user: this.state.currentUser.name,
            game
        };
        debugger;
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

}

export default Lobby;
