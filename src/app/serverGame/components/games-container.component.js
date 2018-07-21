import React,{Component} from 'react';
import './games-container.component.css';
import GameList from "./game-list.component";

export default class GamesContainer extends Component {
    render() {
        return (
            <div className="games-container-component">
                <p>currently available games  : </p>
                <GameList/>
            </div>
        )
    };

    constructor(props) {
        super(...props);
    };

}