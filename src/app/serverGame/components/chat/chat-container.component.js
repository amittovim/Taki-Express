import React,{Component} from 'react';
import ConversationArea from './conversation-area.component';
import ChatInput from './chatInput.component';
import './chat-container.component.css';

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