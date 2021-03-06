import React, {Component} from 'react';
import './lobby.component.css';
import Button from "../../shared/components/button/button.component";
import UsersContainer from "./components/user-list/users-container.component";
import GamesContainer from "./components/games-container.component";
import NewNavbar from "../new-navbar/new-navbar.component";
import LobbyDashboard from "./components/lobby-dashboard/lobby-dashboard.component";
import ContentCard from "../../shared/components/content-card/content-card.component";

// <PROPS>
// username: string;
//handleSuccessfulGameChoosing : function
//handleLogout : function
class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleCreateNewGame = this.handleCreateNewGame.bind(this);
        //this.handleSuccessfulGameChoosing = this.handleSuccessfulGameChoosing.bind(this);

    }

    render() {
        return (
            <div className="lobby-component">
                <NewNavbar username={this.props.username}
                           handleLogout={this.props.handleLogout} />
                <LobbyDashboard />
                <div className="cards-container">
                    <ContentCard>
                        <UsersContainer />
                    </ContentCard>
                    <ContentCard>
                        <GamesContainer username={this.props.username}
                                        handleSuccessfulGameChoosing={this.props.handleSuccessfulGameChoosing} />
                        <div className="new-game-button">
                            <Button label={'CREATE NEW GAME'}
                                    onClick={this.handleCreateNewGame}
                                    isDisabled={false} />
                        </div>
                    </ContentCard>
                </div>
            </div>
        );
    }

    handleCreateNewGame() {
        this.props.handleCreateNewGame();
    }
}

export default Lobby;
