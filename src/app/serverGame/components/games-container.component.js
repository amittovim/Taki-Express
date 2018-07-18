import React,{Component} from 'react';
import ConversationArea from './conversation-area.component';
import ChatInput from './chatInput.component';
import './chat-container.component.css';
import UsersArea from "./users-area.component";

export default class GamesContainer extends Component {
    render() {
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