import React, {Component} from 'react';

export default class UsersArea extends Component {
    render() {
            if (this.state.usersList) {
                return (
                    <div className="users-area-component">
                        <ul>
                            {this.state.usersList.map((userName) => (
                                <li key={userName}>{ userName}</li>
                            ))}
                        </ul>
                    </div>
                )
            }
            return;
    }

    constructor(props) {
        super(...props);

        this.state = {
            usersList: []
        };

        this.getOnlineUsersList = this.getOnlineUsersList.bind(this);
    }

    componentDidMount() {
        this.getOnlineUsersList();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }


    getOnlineUsersList() {
        return fetch('/lobby/allUsers/', {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok){
                    throw response;
                }
                this.timeoutId = setTimeout(this.getOnlineUsersList, 700);
                return response.json();
            })
            .then(usersList => {
                this.setState(()=>({usersList}));
            })
            .catch(err => {throw err});
    }
}