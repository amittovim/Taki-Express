import React from 'react';
import ReactDOM from 'react-dom';
import "./style.css";
import Game from "./app/game/game.component";
import ServerGame from './app/serverGame/components/server-game.component.js'

const App = () => {
    return (<Game />);
    // return (<ServerGame />);
};

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
