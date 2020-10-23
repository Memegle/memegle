import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import Analytics from "react-router-ga";

import {isInDevelopmentMode, LOG} from "./utils";
import Main from './Main'

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
            serverUrl = 'http://localhost:8080';
            LOG('Local is up, using ' + serverUrl);
        })
        .catch(error => {
            serverUrl = 'http://www.memegle.live:8080';
            LOG('Can\'t connect to localhost, using ' + serverUrl);
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
                <Analytics id={isInDevelopmentMode() ? null : "UA-181206874-1"}>
                    <Main/>
                </Analytics>
            </BrowserRouter>
        )
    }
}

export default App;
