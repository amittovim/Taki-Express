import React,{Component} from 'react';
import ConversationArea from './conversation-area.component';
import './chat-container.component.css';
import ChatInput from "./chat-input.component";

export default class ChatContainer extends Component {
    render() {
        return (
            <div className="chat-container-component">
                <ConversationArea/>
                <ChatInput/>
            </div>
        )
    };

    constructor(props) {
        super(...props);
    };
}