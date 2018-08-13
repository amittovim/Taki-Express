import React,{Component} from 'react';
import ConversationArea from './conversation-area.component';
import './chat-container.component.css';
import ChatInput from "./chat-input.component";

//PROPS:
//consoleMessage : String
//gameId  : number
//
export default class ChatContainer extends Component {
    render() {
        return (
            <div className="chat-container-component">
                <ConversationArea gameId={this.props.gameId}/>

                <ChatInput gameId={this.props.gameId}
                           consoleMessage={this.props.consoleMessage} />
            </div>
        )
    };

    constructor(props) {
        super(...props);
    };
}