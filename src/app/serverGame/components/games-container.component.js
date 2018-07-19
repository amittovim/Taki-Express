import React,{Component} from 'react';
import './games-container.component.css';
import GamesArea from "./games-area.component";

export default class GamesContainer extends Component {
    render() {
        debugger;
        return (
            <div className="games-container-component">
                <p>currently available games  : </p>
                <GamesArea/>
            </div>
        )
    };

    constructor(props) {
        super(...props);
    };

}