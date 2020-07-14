import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import config from 'react-global-configuration';

import Main from './components/MainComponent';
import {isInDevelopmentMode, LOG} from "./util";

const setServerUrl = () => {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, 3000, 'Request timed out');
    });

    const request = fetch('http://localhost:8080/actuator/health');

    LOG('querying localhost...');
    Promise.race([timeout, request])
        .then(response => {
            LOG('Local is up, using localhost');
            config.set({serverUrl: 'http://localhost:8080'});
        })
        .catch(error => {
            LOG('Can\'t connect to localhost, using memegle.live');
            config.set({serverUrl: 'http://www.memegle.live:8080'})
        })
};

class App extends Component {
    componentWillMount() {
        // server startup tasks
        // need better ways, bc call to componentWillMount is causing warnings.
        if (isInDevelopmentMode()) {
            setServerUrl()
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
