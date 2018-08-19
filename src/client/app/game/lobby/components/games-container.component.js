import React, {Component} from 'react';
import './games-container.component.css';
import GameTable from "./game-list/game-table.component";

// <PROPS>
// successfulGameChoosingHandler: Function

export default class GamesContainer extends Component {
    render() {
        return (
            <div className="games-container-component">
                <h2>Currently available games : </h2>
                <GameTable successfulGameChoosingHandler={this.props.successfulGameChoosingHandler} />
            </div>
        )
    };

    constructor(props) {
        super(...props);

    };

}
