import React, {Component} from 'react';
import './games-container.component.css';
import GamesTable from "./games-table/games-table.component";
import GameList from "./game-list/game-list.component";

// <PROPS>
// successfulGameChoosingHandler

export default class GamesContainer extends Component {
    render() {
        return (
            <div className="games-container-component">
                <h2>currently available games : </h2>
                <GameList successfulGameChoosingHandler={this.props.successfulGameChoosingHandler} />
                {/*<GamesTable />*/}
            </div>
        )
    };

    constructor(props) {
        super(...props);

    };

}
