import React, {Component} from 'react';
//props:
// gameId : number
export default class ConversationArea extends Component {
    render() {
        return(
            <div className="conversation-area-component">
                {this.state.content.map((line, index) => (
                    <p key={line.user.name + index}>{line.user.name}:  {line.text}</p>
                ))}
            </div>
        )
    }

    constructor(props) {
        super(...props);

        this.state = {
            content: []
        };

        this.getChatContent = this.getChatContent.bind(this);
    }

    componentDidMount() {
        this.getChatContent();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }


    getChatContent() {
        return fetch('/game/chat/' + this.props.gameId , {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok){
                    throw response;
                }
                this.timeoutId = setTimeout(this.getChatContent, 700);
                return response.json();
            })
            .then(content => {
                this.setState(()=>({content}));
            })
            .catch(err => {throw err});
    }
}