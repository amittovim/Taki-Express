import React, {Component} from 'react';
import Button from "../../../../shared/components/button/button.component";
import './game-table.component.css';

// Props :
// successfulGameChoosingHandler

export default class GameTable extends Component {
    render() {
        if (this.state.gameList.length > 0) {
            const gameItems = this.state.gameList.map((game) => {
                return (
                    <tr key={game.id + game.name}>
                        <td>{game.name}</td>
                        <td>{game.owner.name}</td>
                        <td>{game.playersCapacity}</td>
                        <td>{game.playersEnrolled}</td>
                        <td>{game.isActive}</td>
                        <td>{this.gameStatus(game)}</td>
                        <td>
                            <Button label="Delete"
                                    onClick={this.handleDeleteGame} />
                        </td>
                        <td>
                            <Button label="Join"
                                    onClick={this.props.successfulGameChoosingHandler} />
                        </td>
                        <td>
                            <Button label="View"
                                    onClick={this.props.successfulGameChoosingHandler} />
                        </td>
                    </tr>
                )
            });

            return (
                <table className="games-table-component">
                    <tr>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Players</th>
                        <th>Active Players</th>
                        <th colSpan={2}>Status</th>
                        <th colSpan={3}>Buttons</th>
                    </tr>
                    {gameItems}
                </table>
                // <ul className="game-list-component">
                //     {gameItems}
                // </ul>
            );
        }
        else return (<div></div>);
    }

    constructor(props) {
        super(...props);

        this.state = {
            gameList: []
        };

        this.getGameList = this.getGameList.bind(this);
        this.handleDeleteGame = this.handleDeleteGame.bind(this);

    }

    componentDidMount() {
        this.getGameList();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    // Getters:

    isGameActive() {
        debugger;
        return this.props.game.isActive;
    }

    gameStatus(game) {
        debugger;
        return game.isActive
            ? 'Game is active'
            : `Awaiting ${game.playersCapacity - game.playersEnrolled} players`
    }

    getGameList() {
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
        // TODO: Amit: only if game is empty and you are the owner
        const confirmation = confirm('are you sure?');
        if (confirmation) {
            return fetch('/lobby/games/delete/' + gameId, {method: 'DELETE', credentials: 'include'})
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

