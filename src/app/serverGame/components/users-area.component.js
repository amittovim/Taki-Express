import React, {Component} from 'react';
import _ from 'lodash';

export default class UsersArea extends Component {
    render() {
        let usersList = _.map(this.state.usersList, (user) => {
            return (user.name);
        });
        return(
            <div className="users-area-component">
                <div><ul>{usersList}</ul></div>
            </div>
        )
    }

    constructor(props) {
        super(...props);

        this.state = {
            usersList: []
        };

        this.getUsersList = this.getUsersList.bind(this);
    }

    componentDidMount() {
        this.getUsersList();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }


    getUsersList() {
        return fetch('/lobby/users/', {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok){
                    throw response;
                }
                this.timeoutId = setTimeout(this.getUsersList, 700);
                return response.json();
            })
            .then(usersList => {
                this.setState(()=>({usersList}));
            })
            .catch(err => {throw err});
    }
}