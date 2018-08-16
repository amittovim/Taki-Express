import React, {Component} from 'react';
import './games-container.component.css';
import GameList from "./game-list.component";

// Props :
// successfulGameChoosingHandler

export default class GamesContainer extends Component {
    render() {
        debugger;
        return (
            <div className="games-container-component">
                <h2>Available games: </h2>
                <GameList successfulGameChoosingHandler={this.props.successfulGameChoosingHandler} />
            </div>
        )
    };

    constructor(props) {
        super(...props);

    };

}
