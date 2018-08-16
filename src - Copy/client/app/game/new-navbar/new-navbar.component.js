import React, {Component} from 'react';
import './new-navbar.component.css';
import TakiLogo from '../../../assets/images/logo.png';
import Button from "../../shared/components/button/button.component";

// <PROPS>
// username: string

class NewNavbar extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        return (
            <div className="new-navbar-component">
                <img className="logo"
                     src={TakiLogo}
                     alt="Taki" />
                <div className="navbar-right">
                    <div className='username'>
                        {this.props.username}
                    </div>
                    <Button className="logout btn"
                            label={'Logout'}
                            onClick={this.handleLogout}
                            isDisabled={false} />
                </div>

            </div>
        );
    }
}

export default NewNavbar;
