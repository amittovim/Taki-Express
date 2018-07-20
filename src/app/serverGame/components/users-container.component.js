import React,{Component} from 'react';
import ConversationArea from './conversation-area.component';
import ChatInput from './chatInput.component';
import './chat-container.component.css';
import UsersArea from "./users-area.component";

export default class UsersContainer extends Component {
    render() {
        return (
            <div className="users-container-component">
                <p>users currently online : </p>
                <UsersArea/>
            </div>
        )
    };

    constructor(props) {
        super(...props);
    };

}