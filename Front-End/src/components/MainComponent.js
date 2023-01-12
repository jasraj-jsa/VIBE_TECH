import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Footer from './FooterComponent';
import Contact from "./ContactComponent";
import HomePage from "./HomeComponent";
import withAuth from "./withAuth";
import UserPage from "./UserPage";
import { withRouter } from 'react-router';
class Main extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Switch>
                    <Route path='/home' component={HomePage} />
                    <Route path='/contact' component={Contact} />
                    <Route path='/auth' component={withAuth(UserPage)} />
                    <Redirect to="/home" />
                </Switch>
                <Footer />
            </div>
        );
    }
}

export default withRouter(Main);