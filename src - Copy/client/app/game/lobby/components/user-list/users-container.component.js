import React, {Component} from 'react';
import UsersArea from "./users-area.component";
import './users-container.component.css';

export default class UsersContainer extends Component {
    render() {
        return (
            <div className="users-container-component">
                <h2>Logged in users: </h2>
                <UsersArea />
            </div>
        )
    };

    constructor(props) {
        super(...props);
    };

}
