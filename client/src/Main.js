import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import React, {Component} from "react";

import paths from "./routes/paths";
import Welcome from "./routes/Welcome";
import Result from "./routes/Result"


class Main extends Component {
    render() {
        const ResultPage = ({location}) => {
            return (
                <Result queryString={location.search}/>
            )
        }

        return (
            <Switch>
                <Route path={paths.welcome} component={Welcome}/>
                <Route path={paths.search} component={ResultPage}/>
                <Redirect to={paths.default}/>
            </Switch>
        )
    }
}

export default withRouter(Main);