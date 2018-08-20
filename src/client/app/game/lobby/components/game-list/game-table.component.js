import React, {Component} from 'react';
import Button from "../../../../shared/components/button/button.component";
import './game-table.component.css';

// Props :
// handleSuccessfulGameChoosing
// username
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
                            <Button label="Join"
                                    onClick={() => this.onClickJoinHandler(game)}
                                    isDisabled={!this.shouldJoinBeEnabled(game)}/>
                        </td>
                        <td>
                            <Button label="View"
                                    onClick={() => this.props.handleSuccessfulGameChoosing(game)}/>
                        </td>
                        <td>
                            <Button label="Delete"
                                    onClick={() => this.handleDeleteGame(game)}
                                    isDisabled={!this.shouldDeleteBeEnabled(game)}/>
                        </td>
                    </tr>
                )
            });

            return (
                <table className="games-table-component">
                    <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Players</th>
                        <th>Active Players</th>
                        <th colSpan={2}>Status</th>
                        <th colSpan={3}>Buttons</th>
                    </tr>
                    {gameItems}
                    </tbody>
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
        this.onClickJoinHandler = this.onClickJoinHandler.bind(this);
        this.shouldDeleteBeEnabled= this.shouldDeleteBeEnabled.bind(this);
        this.shouldJoinBeEnabled = this.shouldJoinBeEnabled.bind(this);
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

    handleDeleteGame(game) {
        // TODO: Amit: only if game is empty and you are the owner
        debugger;
        const confirmation = confirm('are you sure?');
        if (confirmation) {
            return fetch('/lobby/games/delete/' + game.id, {method: 'DELETE', credentials: 'include'})
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

    onClickJoinHandler(game) {
        if (game.isActive === true) {
            return null;
        } else {
            this.props.handleSuccessfulGameChoosing(game);
        }

    }

    shouldDeleteBeEnabled(game) {
        debugger;
        if ((game.owner.name === this.props.username) && (game.isActive !== true)
            && ((game.isBotEnabled === false && game.playersEnrolled === 0) ||
                (game.isBotEnabled === true && game.playersEnrolled === 1))) {
            return true;
        }
    }


    shouldJoinBeEnabled(game) {
        debugger;
        if (game.isActive===false) {
            return true;
        }
    }

}

