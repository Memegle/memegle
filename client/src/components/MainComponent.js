import React, { Component } from 'react';
//import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Welcome from './WelcomeComponent';
import Result from './ResultComponent';

class Main extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/welcome" component={() => <Welcome />} />
                    <Route path="/result" component={(props) => <Result {...props}/>} />
                    <Redirect to="/welcome" />
                </Switch>
            </div>
        )
    }
}

export default withRouter(Main);