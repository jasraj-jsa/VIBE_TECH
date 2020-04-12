import React, { Component } from 'react';
import UserHeader from "./UserHeader";
import { Switch, Route, Redirect } from 'react-router-dom';
import SearchEngine from "./SearchComponent";
import UserPostsComponent from "./UserPostsComponent";
import FeedComponent from "./FeedComponent";
import { Spinner } from 'reactstrap';
import RecommendationComponent from "./RecommendationComponent";
class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: ''
        }
    }
    componentDidMount() {
        fetch('/current', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.setState({ user: data.body });
            })
            .catch(err => console.log(err));

    }
    render() {
        if (this.state.user.length == 0) {
            return <><Spinner style={{ marginTop: 150 }} color="primary" /><div style={{ marginTop: 250 }}></div></>;
        }
        return (
            <>
                <UserHeader current={this.state.user} />
                <Switch>
                    <Route path="/auth/search" render={(props) => <SearchEngine {...props} current={this.state.user} />} />
                    <Route path="/auth/mypage" render={(props) => <UserPostsComponent {...props} current={this.state.user} />} />
                    <Route path="/auth/feed" render={(props) => <FeedComponent {...props} current={this.state.user} />} />
                    <Route path="/auth/recommendations" render={(props) => <RecommendationComponent {...props} current={this.state.user} />} />
                    <Redirect to="/auth/search" />
                </Switch>
            </>
        );
    }
}

export default UserPage;