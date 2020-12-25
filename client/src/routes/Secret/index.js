import React, {Component} from 'react';
import styles from "./secret.module.css"
import {LOG} from 'utils';
import {performCount} from "../../actions/secret";

class Secret extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: '',
        };
    }
        componentDidMount() {
        LOG('In secret page');
        this.retrieveSecrets();
    }

    retrieveSecrets = () =>{
        performCount().then(res=>{
            this.setState({count:res})
        }).catch(error => LOG(error.message))
    }
    render() {
        return (
            <div className={styles.body}>
                <h1>我们一共有{this.state.count}条表情</h1>
            </div>
        )
    }
}

export default Secret;
