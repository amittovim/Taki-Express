import React, {Component} from 'react';
import GameListItem from './game-list-item.component';

export default class GameList extends Component {
    render() {
        if (this.state.gameList.length > 0) {
            return (
                <div className="game-list-component">
                    <ul>
                        {this.state.gameList.map((game) => (
                            <li key={game.id + game.name}>
                                        game name : {game.name} <br/>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
        return (
            <div></div>
        );    }
        constructor(props)
        {
            super(...props);

            this.state = {
                gameList: []
            };

            this.getGameList = this.getGameList.bind(this);
        }

        componentDidMount()
        {
            this.getGameList();
        }

        componentWillUnmount()
        {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
        }


        getGameList()
        {
            return fetch('/lobby/games/', {method: 'GET', credentials: 'include'})
                .then((response) => {
                    if (!response.ok) {
                        throw response;
                    }
                    this.timeoutId = setTimeout(this.getOnlineUsersList, 1000);
                    return response.json();
                })
                .then(gameList => {
                    this.setState(() => ({gameList: gameList}));
                })
                .catch(err => {
                    throw err
                });
        }

    }

