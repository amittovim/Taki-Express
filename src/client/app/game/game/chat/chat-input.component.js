import React, {Component} from 'react';
//PROPS
//consoleMessage: String
// gameId : Number
export default class ChatInput extends Component {
    render() {
        return (
            <form className="chat-input-component" onSubmit={this.sendText}>
                <input disabled={this.state.sendInProgress} placeholder="enter text here"
                       ref={input => this.inputElement = input} />
                <input type="submit" className="btn" disabled={this.state.sendInProgress} value="Send" />
            </form>
        )
    }

    constructor(props) {
        super(...props);
        this.state = {
            sendInProgress: false
        };

        this.lastConsoleMessage = '';

        this.sendText = this.sendText.bind(this);
        this.sendConsoleText = this.sendConsoleText.bind(this);
    }

    componentWillMount() {

    }

    componentWillReceiveProps() {
        if ((this.props.consoleMessage !== '') && (this.props.consoleMessage !== this.lastConsoleMessage)) {
            this.sendConsoleText(this.props.consoleMessage);
            this.lastConsoleMessage = this.props.consoleMessage;
        }
    }

    sendText(e) {
        e.preventDefault();
        this.setState(() => ({sendInProgress: true}));
        const id = 'user';
        const text = this.inputElement.value;
        const body = {
            text: text,
            id: id
        }
        fetch('/game/chat/' + this.props.gameId, {method: 'POST', body: JSON.stringify(body), credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                this.setState(() => ({sendInProgress: false}));
                this.inputElement.value = '';
            });
        return false;
    }

    sendConsoleText(txt) {
        this.setState(() => ({sendInProgress: true}));
        const id = 'server';
        const text = txt;
        const body = {
            text: text,
            id: id
        }
        fetch('/game/chat/' + this.props.gameId, {method: 'POST', body: JSON.stringify(body), credentials: 'include'})
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                this.setState(() => ({sendInProgress: false}));
                this.inputElement.value = '';
            });
        return false;
    }

}
