import React, { Component } from 'react';
//import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Welcome from './WelcomeComponent';
import Result from './ResultComponent';

class Main extends Component {

    render() {

        const SearchResult = ({ location }) => {
            return (
                <Result queryString={location.search}/>
            );
        }

        return (
            <div>
                <Switch>
                    <Route path="/welcome" component={Welcome} />
                    <Route path="/search/" component={SearchResult} />
                    <Redirect to="/welcome" />
                </Switch>
            </div>
        )
    }
}

export default withRouter(Main);