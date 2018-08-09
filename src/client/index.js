import React from 'react';
import ReactDOM from 'react-dom';
import "./style.css";
import Taki from "./app/game/taki.component";

const App = () => {
    // return (<Game />);
    return (<Taki />);
};

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
