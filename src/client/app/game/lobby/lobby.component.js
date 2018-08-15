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
                <ChatContainer message={''} />
            </div>
        );
    }

    handleCreateNewGame() {
        this.props.handleCreateNewGame();
    }
}

export default Lobby;
