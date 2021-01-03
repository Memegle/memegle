import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import paths from "./routes/paths";
import PrintNum from "./PrintNum";

class NewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toWelcome: false,
        };
        this.handleRedirection = this.handleRedirection.bind(this);
    }

    handleRedirection(event) {
        event.preventDefault();
        this.setState({toWelcome: true});
    }

    render() {
        if (this.state.toWelcome) {
            return <Redirect to='welcome'/>;
        }

        return(
            <div>
            <PrintNum />
            <button onClick={this.handleRedirection} > Go Back! </button>
        </div>
    )
    }
};

export default NewPage;