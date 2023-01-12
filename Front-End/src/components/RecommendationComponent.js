import React, { Component } from "react";
import { withRouter } from 'react-router';
import { Button, Media, Spinner } from "reactstrap";
import userimg from "../images/userimg.png";
class RecommendationComponent extends Component {
    constructor(props) {
        super(props);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.posts = this.posts.bind(this);
        this.fetchPosts = this.fetchPosts.bind(this);
        this.recommendation = this.recommendation.bind(this);
        this.state = {
            allheadings: [],
            alldesc: [],
            users: [],
            recommended: [],
            flag: 0
        }
    }

    recommendation() {
        fetch("/recommendations/" + this.props.current, {
            method: "POST",
            body: JSON.stringify({ allheadings: this.state.allheadings, alldesc: this.state.alldesc }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                if (res.status == 200)
                    return res.json();
            })
            .then((data) => {
                if (data.output.length) {
                    var o = data.output;
                    var x = [];
                    var recommended = new Array();
                    for (var i = 0; i < o.length; i++) {
                        x = this.state.users.filter((item) => { return (item.username == o[i].id); })[0];
                        recommended.push({ username: o[i].id, bio: x.bio });
                    }
                    this.setState({ recommended: recommended });
                }
            })
    }
    componentDidMount() {
        this.fetchUsers();
    }
    fetchUsers() {
        var h = this;
        fetch("/users", {
            method: "GET",
            headers: {
                'Accept': "application/json"
            }
        })
            .then((res) => {
                if (res.status == 200)
                    return res.json();
            })
            .then((data) => {
                data.users = data.users.filter((item) => { return (item.username != "admin") })
                this.setState({ users: data.users }, () => { this.posts(); });
            })
    }
    fetchPosts(user) {
        fetch('/posts/' + user, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                if (res.status == 200)
                    return res.json();
                return "null"
            })
            .then((data) => {
                if (data != "null" && data.body.length) {
                    var post = data.body;
                    var headings = "";
                    var desc = "";
                    for (var i = 0; i < post.length; i++) {
                        headings = headings.concat(post[i].heading + " ");
                        desc = desc.concat(post[i].description + " ");
                    }
                    var output = this.state.allheadings;
                    var headitem = { id: user, content: headings }
                    if (!output.includes(headitem))
                        output.push(headitem);
                    var descitem = { id: user, content: desc };
                    var output1 = this.state.alldesc;
                    if (!output1.includes(descitem))
                        output1.push(descitem);
                    this.setState({ allheadings: output, alldesc: output1 });
                }
            })
            .catch(err => console.log(err));
    }
    posts() {
        var users = this.state.users;
        if ((users.length) != 0) {
            for (var i = 0; i < users.length; i++) {
                this.fetchPosts(users[i].username);
            }
        }
    }
    render() {
        function RenderUser({ user, here }) {
            if (user.username == here.props.current) {
                return null;
            }
            return (
                <Media >
                    <Media>
                        <Media object src={userimg} style={{ maxHeight: 75, maxWidth: 75 }} alt="Generic placeholder image" />
                    </Media>
                    <Media body>
                        <Media heading style={{ marginLeft: 10 }}>
                            {user.username}
                        </Media>
                        <Media style={{ marginLeft: 50 }}>
                            Bio: {user.bio}
                        </Media>
                    </Media>
                </Media>
            );
        }
        function RenderAllUsers({ users, here }) {
            if (here.state.flag == 0) {
                return null;
            }
            if (users.length == 0) {

                return <h2 style={{ marginDown: 150 }}>No recommendations found! Please add more posts!</h2>;

            }
            var x = users.map((u) =>
                <>
                    <Media>
                        <RenderUser user={u} here={here} />
                    </Media><br />
                </>
            );
            return (<div className="container"> {x} </div>);
        }

        return (<>
            <h2 style={{ marginTop: 150, marginRight: 10 }}>
                <div id="myrecommendations"><Button size="lg" outline color="primary" onClick={() => { this.recommendation(); document.getElementById("myrecommendations").innerHTML = ""; this.setState({ flag: 1 }); }}> Generate recommendations</Button></div>
            </h2><div style={{ marginTop: 245 }}>
                <RenderAllUsers users={this.state.recommended} here={this} />
            </div></>
        );
    }
}

export default withRouter(RecommendationComponent);