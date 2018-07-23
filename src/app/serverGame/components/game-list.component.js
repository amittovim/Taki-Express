import React, {Component} from 'react';
import GameListItem from './game-list-item.component';

// Props :
// successfulGameChoosingHandler

export default class GameList extends Component {
    render() {
        if (this.state.gameList.length > 0) {
            const gameItems = this.state.gameList.map((game) => {
                return (
                    <GameListItem key={game.id + game.name}
                                  game={game}
                                  successfulGameChoosingHandler={this.props.successfulGameChoosingHandler}
                                  deleteGameHandler={this.props.deleteGameHandler}
                    />
                );
            });
            return (
                <ul className="gameList-component">
                    {gameItems}
                </ul>
            );
        }
        else return (<div></div>);
    }
        constructor(props)
        {
            super(...props);

            this.state = {
                gameList: []
            };

            this.getGameList = this.getGameList.bind(this);
            this.handleDeleteGame = this.handleDeleteGame.bind(this);

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
                .then((res) => {
                    if (!res.ok) {
                        throw res;
                    }
                    this.timeoutId = setTimeout(this.getGameList, 1000);
                    return res.json();
                })
                .then(gameList => {
                    this.setState(() => ({gameList}));
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                });
        }

    handleDeleteGame(gameId) {
        const confirmation = confirm('are you sure?');
        if (confirmation) {
            return fetch('/games/delete:' + gameId, {method: 'DEL', credentials: 'include'})
                .then((res) => {
                    if (!res.ok) {
                        throw res;
                    }
                    return res.json();
                })
                .then((gameList) => {
                    this.setState(() => ({gameList}));
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                });
        }
    }

}

