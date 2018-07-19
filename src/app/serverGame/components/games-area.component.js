import React, {Component} from 'react';

export default class GamesArea extends Component {
    render() {
        debugger;
        if (this.state.usersList) {
            return (
                <div className="games-area-component">
                    <ul>
                        {this.state.gamesList.map((game) => (
                            <li key={game.name}>
                                Game Name: {game.name} \br
                                Game Owner: {game.owner} \br
                                Number of players in game: {game.numOfPlayers} \br
                                BOT player enabled: {game.botPlayerEnabled} \br
                                Game status: { game.hasStarted ? 'AVAILABLE' : 'CURRENTLY-RUNNING' }

                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
        return (
            <div></div>
        );
    }

    constructor(props) {
        super(...props);

        this.state = {
            gamesList: []
        };

        this.getGamesList = this.getGamesList .bind(this);
    }

    componentDidMount() {
        this.getGamesList ();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }


    getGamesList () {
        return fetch('/lobby/games/', {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok){
                    throw response;
                }
                this.timeoutId = setTimeout(this.getOnlineUsersList, 1000);
                return response.json();
            })
            .then(gamesList => {
                this.setState(()=>({gamesList}));
            })
            .catch(err => {throw err});
    }
}