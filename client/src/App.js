import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';

import Main from './components/MainComponent';
import {isInDevelopmentMode, LOG} from "./util";

export var serverUrl = 'http://www.memegle.live:8080';

let urlChecked = false;

const setServerUrl = () => {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, 3000, 'Request timed out');
    });

    const request = fetch('http://localhost:8080/actuator/health');

    LOG('querying localhost...');
    Promise.race([timeout, request])
        .then(response => {
            LOG('Local is up, using localhost');
            serverUrl = 'http://localhost:8080';
            urlChecked = true;
        })
        .catch(error => {
            LOG('Can\'t connect to localhost, using memegle.live');
            serverUrl = 'http://www.memegle.live:8080';
            urlChecked = true;
        })
};

class App extends Component {
    constructor(props) {
        super(props);

        if (isInDevelopmentMode() && !urlChecked) {
            setServerUrl();
            urlChecked = true;
        }
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Main/>
                </div>
            </BrowserRouter>
        )
    }
}

export default App;
