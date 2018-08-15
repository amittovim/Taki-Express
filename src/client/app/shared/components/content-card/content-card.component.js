import React, {Component} from 'react';
import './content-card.component.css';

class ContentCard extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        return (
            <div className="content-card-component">
                <div>{this.props.children}</div>
            </div>
        );
    }
}

export default ContentCard;
