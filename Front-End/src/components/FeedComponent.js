import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Spinner, Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label, ButtonGroup, Media, Alert
} from 'reactstrap';
import userimg from "../images/userimg.png";
import Toast from "light-toast";

class FeedComponent extends Component {
    constructor(props) {
        super(props);
        this.setFriends = this.setFriends.bind(this);
        this.setNewFriend = this.setNewFriend.bind(this);
        this.setRequests = this.setRequests.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.reject = this.reject.bind(this);
        this.fetchFriends = this.fetchFriends.bind(this);
        this.toggleCommentType = this.toggleCommentType.bind(this);
        this.handleCommentTypeChange = this.handleCommentTypeChange.bind(this);
        this.state = {
            friends: [],
            allposts: [],
            username: '',
            users: [],
            error: '',
            requests: [],
            isFriendsOpen: false,
            isAddCommentOpen: false,
            isViewCommentsOpen: false,
            isRequestsOpen: false,
            isAddFriendsOpen: false,
            friendName: '',
            requestsSent: [],
            allComments: [],
            myComment: '',
            lookCount: 0,
            postId: 0,
            isCommentType: false,
            CommentType: "Show All"
        }
    }
    
    componentDidMount() {
        this.fetchFriends();
        //this.posts();
        localStorage.clear();
        this.fetchRequestsSent(0);
    }
    handleCommentTypeChange(e){
        let data = e.target.value;
        this.setState({CommentType: data})
        
    }
    toggleCommentType() {
        this.setState({
            isCommentType: !this.state.isCommentType
        });
    }
    

    checkLike(pid) {
        var posts = this.state.allposts;
        for (var i = 0; i < posts.length; i++) {
            if (posts[i]._id == pid) {
                this.addLike(pid);
                if (posts[i].liked == false)
                    return 0;
                return 1;
            }
        }
    }
    removeFriend(user) {
        var h = this;
        fetch("/users/" + this.props.current + "/friends", {
            method: "DELETE",
            body: JSON.stringify({ username: user }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                if (res.status == 200) {
                    h.fetchFriends();
                    document.getElementById("renderFriend" + user).innerHTML = "";
                    return res.json();
                }
                else {
                    return "null";
                }
            })
            .catch(err => console.log(err));
    }
    reject(user) {
        var h = this;
        fetch("/users/" + this.props.current + "/requestsSent", {
            method: "DELETE",
            body: JSON.stringify({ username: user }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                if (res.status == 200) {
                    h.fetchRequestsSent(0);
                    document.getElementById("renderRequest" + user).innerHTML = "";
                    return res.json();
                }
                else {
                    return "null";
                }
            })
            .catch(err => console.log(err));
    }
    accept(user) {
        this.reject(user);
        var h = this;
        fetch("/users/" + this.props.current + "/friends", {
            method: "PUT",
            body: JSON.stringify({ username: user }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                if (res.status == 200) {
                    h.fetchRequestsSent(0);
                    document.getElementById("renderRequest" + user).innerHTML = "";
                    return res.json();
                }
                else {
                    return "null";
                }
            })
            .catch(err => console.log(err));
    }
    addComment(PostId){
        var h = this;
        let comm = localStorage.getItem("customComment");
        fetch("/comments/" + PostId, {
            method: "PUT",
            body: JSON.stringify({ comment: comm, postedBy: h.props.current }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            }
            else {
                return "null";
            }
        })
    }
    async viewComments(PostId){
        let res = await fetch("/comments/" + PostId, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if(res.status == 200){
        const data = await res.json();
        return data.comments;}
        return [];
    }
    fetchRequestsSent(flag) {
        var h = this;
        fetch("/users/" + this.props.current + "/requestsSent", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                if (res.status == 200) {
                    return res.json();
                }
                else {
                    return "null";
                }
            })
            .then((data) => {
                if (data != "null") {
                    if (flag) {
                        this.setState({ requestsSent: data.requestsSent, requests: data.requests }, () => {
                            var requests = data.requestsSent;
                            for (var i = 0; i < requests.length; i++) {
                                document.getElementById("request" + requests[i]).innerHTML = "";
                            }
                        });
                    }
                    else {
                        this.setState({ requestsSent: data.requestsSent, requests: data.requests });
                    }
                }
            })
            .catch(err => console.log(err));

    }
    sendRequest(user) {             //Requests sent
        var h = this;
        fetch("/users/" + this.props.current + "/requestsSent", {
            method: "POST",
            body: JSON.stringify({ username: user }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                if (res.status == 200) {
                    document.getElementById("request" + user).innerHTML = "";
                    ReactDOM.render(<Alert color="success" style={{ marginLeft: 370 }}><span className="fa fa-check"></span> Request Sent!</Alert>, document.getElementById("request" + user));
                    setTimeout(() => { document.getElementById("render" + user).innerHTML = ""; },
                        500, () => {
                            h.fetchRequestsSent(1);
                        });
                    return res.json();


                }
                else {
                    return "null";
                }
            })
            .catch(err => console.log(err));
    }
    handleUsername() {
        if (this.state.username.length == 0) {
            this.setState({ users: '' });
            return null;
        }
        console.log(this.state.username);
        fetch("/users/" + this.state.username, {
            method: "PUT",
            body: JSON.stringify({ current: this.props.current }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                if (res.status == 200) {
                    return res.json();
                }
                else {
                    return null;
                }
            })
            .then((data) => {
                if (data != null && data.error.length == 0) {
                    var users = data.users;
                    if (users.length != 0) {
                        this.setState({ users: users });
                    }
                    else
                        this.setState({ users: "" });
                }
                else {
                    this.setState({ users: "" });
                    return null;
                }
            })
            .catch(err => console.log(err));

    }
    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        }, () => { this.handleUsername() });
    }
    setFriends() {
        this.setState({ isFriendsOpen: !this.state.isFriendsOpen });
    }
    setRequests() {

        this.setState({ isRequestsOpen: !this.state.isRequestsOpen });
    }
    setNewFriend() {
        this.setState({ isAddFriendsOpen: !this.state.isAddFriendsOpen });
    }
    setAddComment() {
        this.setState({ isAddCommentOpen: !this.state.isAddCommentOpen });
    }
    async setViewComments(pid) {
        let data = await this.viewComments(pid);
        this.setState({ isViewCommentsOpen: !this.state.isViewCommentsOpen, allComments: data });
    }
    fetchFriends() {
        var h = this;
        fetch('/users/' + this.props.current + "/friends", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                if (res.status == 200) {
                    return res.json();
                }
                else {
                    return "null";
                }
            })
            .then((data) => {
                if (data != "null") {
                    this.setState({ friends: data.friends }, () => { h.posts(); });
                }
            })
            .catch(err => console.log(err));
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
                    var joined = this.state.allposts;
                    for (var i = 0; i < post.length; i++) {
                        post[i].username = user;
                        if (!joined.includes(post[i])) {
                            joined.push(post[i]);
                        }
                    }
                    this.setState({ allposts: joined });
                }
            })
            .catch(err => console.log(err));
    }
    posts() {
        var users = this.state.friends;
        if ((users.length) != 0) {
            for (var i = 0; i < users.length; i++) {
                this.fetchPosts(users[i]);
            }
        }
    }
    render() {
        if (this.state.friends.length == 0) {
            var h = this;
            return (
                <div>
                    <h2 style={{ marginTop: 150, marginRight: 20 }} >Your friends are missing!
                    <ButtonGroup>
                            <Button color="primary" style={{ marginLeft: 20 }} outline onClick={h.setNewFriend}><span className="fa fa-user-plus fa-lg"></span> Add Contacts</Button>
                            <Button color="info" style={{ marginLeft: 10 }} outline onClick={h.setRequests}><span className="fa fa-th-list fa-lg"></span> Requests</Button>
                        </ButtonGroup>
                    </h2>
                    <div style={{ marginTop: 150 }}></div>

                    <Modal size="lg" isOpen={h.state.isAddFriendsOpen} toggle={h.setNewFriend} onClosed={() => { this.componentDidMount(); this.setState({ username: "" }) }}>
                        <ModalHeader toggle={h.setNewFriend} >Add a new friend</ModalHeader>
                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <Label htmlFor="username">Search by Username</Label><br />
                                    <Input type="search" id="username" name="username" value={h.state.username} onChange={h.handleInputChange} required />
                                </FormGroup>
                                <FormGroup id="timepass">
                                    <RenderAllUsers users={h.state.users} here={h} />
                                </FormGroup>
                            </Form>
                        </ModalBody>
                    </Modal>

                    <Modal isOpen={h.state.isRequestsOpen} toggle={h.setRequests} onClosed={() => { this.componentDidMount(); }}>
                        <ModalHeader toggle={h.setRequests}>Requests</ModalHeader>
                        <ModalBody>
                            <RenderAllRequests users={h.state.requests} here={h} />
                        </ModalBody>
                    </Modal>

                </div>
            );
        }
        else if (this.state.allposts.length == 0) {
            var h = this;
            return (<div><><h2 style={{ marginTop: 150, marginRight: 10 }}>Your friends haven't posted anything!<Button onClick={this.setFriends} color="primary" style={{ marginLeft: 10 }} outline><span className="fa fa-users fa-lg"></span> My Contacts</Button></h2><div style={{ marginTop: 150 }}></div></>

                <Modal isOpen={h.state.isFriendsOpen} toggle={h.setFriends} onClosed={() => { window.location.reload(false); this.componentDidMount(); }}>
                    <ModalHeader toggle={h.setFriends}>Friends</ModalHeader>
                    <ModalBody>
                        <RenderAllFriends users={h.state.friends} here={h} />
                    </ModalBody>
                </Modal>
            </div>
            );
        }
        function RenderUser({ user, here }) {
            if (user.username == here.props.current) {
                return null;
            }
            return (
                <Media id={"render" + user.username} >
                    <Media>
                        <Media object src={userimg} style={{ maxHeight: 75, maxWidth: 75 }} alt="Generic placeholder image" />
                    </Media>
                    <Media body>
                        <Media heading style={{ marginLeft: 10 }}>
                            {user.username}
                        </Media>
                        <Media style={{ marginLeft: 10 }}>
                            Bio: {user.bio}
                        </Media>
                        <Media>
                            <div id={"request" + user.username} ><Button style={{ marginLeft: 600 }} color="primary" onClick={() => { here.sendRequest(user.username); }} outline><span className="fa fa-user-plus fa-lg" ></span></Button></div>
                        </Media>


                    </Media>
                </Media>
            );
        }
        function RenderRequest({ user, here }) {
            return (
                <Media id={"renderRequest" + user}>
                    <Media>
                        <Media object src={userimg} style={{ maxHeight: 75, maxWidth: 75 }} alt="Generic placeholder image" />
                    </Media>
                    <Media body>
                        <Media heading style={{ marginLeft: 10 }}>
                            {user}
                            <ButtonGroup style={{ marginLeft: 250 }}><Button onClick={() => { here.accept(user); }} outline color="success"><span className="fa fa-check fa-lg" ></span></Button>
                                <Button style={{ marginLeft: 10 }} outline onClick={() => { here.reject(user); }} color="danger" > <span className="fa fa-times fa-lg"></span></Button>
                            </ButtonGroup>
                        </Media>
                    </Media>
                </Media>
            );
        }
        function RenderFriend({ user, here }) {
            return (
                <Media id={"renderFriend" + user}>
                    <Media>
                        <Media object src={userimg} style={{ maxHeight: 75, maxWidth: 75 }} alt="Generic placeholder image" />
                    </Media>
                    <Media body>
                        <Media heading style={{ marginLeft: 10 }}>
                            {user}
                        </Media>
                        <Button style={{ marginLeft: 300 }} outline onClick={() => { here.removeFriend(user); Toast.success("Removed from contacts", 1000, () => { }); }} color="danger" > <span className="fa fa-minus-circle fa-lg"></span></Button>

                    </Media>
                </Media>
            );
        }
        function RenderAddComment({h,pid}){
            return (
                <Form onSubmit={() => {h.addComment(pid);}}>
                        <FormGroup>
                                <Label htmlFor="mycomment">Comment</Label>
                                <Input type="text" id="mycomment"
                                    value={localStorage.getItem('customComment')} onChange={(event) => {localStorage.setItem('customComment',event.target.value)}} required />
                                <br /><Button type="submit" value="submit" color="primary">Done</Button><br />
                            </FormGroup>
                        </Form>
            );
        }
        function RenderDropdown({h}){
            return (
            <>
            <select onChange={h.handleCommentTypeChange} value={h.state.CommentType}>
            <option value="Show All"> Show All</option>
            <option value="Show Only Positive Comments"> Show Only Positive Comments</option>         
            <option value="Show Only Neutral Comments"> Show Only Neutral Comments</option>
            <option value="Show Only Negative Comments"> Show Only Negative Comments</option>         
            </select>
            </>);
        }
        function RenderAllComments({ h,pid }) {
            let comments = h.state.allComments;
            // console.log(comments);
            let val = null
            if(h.state.CommentType=="Show Only Positive Comments")
                val = "positive"
            else if(h.state.CommentType=="Show Only Negative Comments")
                val = "negative"
            else if(h.state.CommentType=="Show Only Neutral Comments")
                val = "neutral"
            if(val){
                let new_commnets = h.state.allComments.filter(function (e) {
                return e.type==val;
            });
            // h.setState({allComments: new_commnets})
            comments = new_commnets
        }
            if(comments.length){
            return (
            <div className="container"> 
            <RenderDropdown h={h}/>
            <br/><br/>
            {comments.map(p => 
                <>
                    <Card>
                    <CardBody>
                    <CardSubtitle style={{ marginLeft: 80 }}>{"Posted By: " + (p.postedBy == h.props.current ? "You": p.postedBy)}</CardSubtitle>
                   <CardSubtitle style={{ marginLeft: 80 }}>{p.postedAt}</CardSubtitle>
                    <br/><CardText><b>{p.comment}</b></CardText>
                </CardBody>
                    </Card><br />
                </>
            
                
            )} </div>);
            }
            return (<div className="container"><RenderDropdown h={h}/><br/><br/>
                No Comments!</div>);
        }

        function RenderPost({ post, h }) {
            return (
                <CardBody>
                    <CardTitle>{post.heading}</CardTitle>
                    <CardSubtitle>{"Posted By: " + post.username}</CardSubtitle>
                    <br /><br /><CardSubtitle style={{ marginLeft: 800 }}>{post.postedAt}</CardSubtitle>
                    <br /><CardText>{post.description}</CardText><br/>
                    <Button outline color="primary" onClick={() => {h.setAddComment(post._id); localStorage.setItem('currentPostId',post._id)}}><span className="fa fa-pencil-square-o fa-lg"></span> Add a comment</Button>
                    <span>  </span><Button outline color="primary" onClick={() => { h.setViewComments(post._id);}}><span className="fa fa-list fa-lg"></span> View Comments</Button><br/>
                    <Modal id = {post._id} isOpen={h.state.isAddCommentOpen} toggle={() => {h.setAddComment(post._id);}}>
                        <ModalHeader toggle={() => {h.setAddComment(post._id);}}>Add a comment!</ModalHeader>
                        <ModalBody>
                        <RenderAddComment h = {h} pid={localStorage.getItem('currentPostId')}/>
                        </ModalBody>
                    </Modal>
                    <Modal id={post._id} isOpen={h.state.isViewCommentsOpen} toggle={() => {h.setViewComments(post._id);}}>
                        <ModalHeader toggle={() => {h.setViewComments(post._id);}}>Comments</ModalHeader>
                        <ModalBody>
                        <RenderAllComments h = {h} pid={post._id}/> 
                        </ModalBody>
                    </Modal>
                </CardBody>
            );

        }
        function RenderAllPosts({ posts, h }) {
            var x = posts.map((p) =>
                <>
                    <Card>
                        <RenderPost post={p} h={h} />
                    </Card><br />
                </>
            );
            return (<div className="container"> {x} </div>);
        }
        function RenderAllUsers({ users, here }) {
            if (users.length == 0) {
                return <div>No users found!</div>;
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
        function RenderAllRequests({ users, here }) {
            if (users.length == 0) {
                return <div>No requests</div>;
            }
            var x = users.map((u) =>
                <>
                    <Media>
                        <RenderRequest user={u} here={here} />
                    </Media><br />
                </>
            );
            return (<div className="container"> {x} </div>);
        }
        function RenderAllFriends({ users, here }) {
            if (users.length == 0) {
                return <div>No friends!</div>;
            }
            var x = users.map((u) =>
                <>
                    <Media>
                        <RenderFriend user={u} here={here} />
                    </Media><br />
                </>
            );
            return (<div className="container"> {x} </div>);
        }
        var h = this;
        return (
            <>
                <ButtonGroup style={{ marginTop: 20, marginRight: 665 }}>
                    <Button color="primary" outline onClick={this.setFriends}><span className="fa fa-users fa-lg"></span> My Contacts</Button>
                    <Button color="primary" style={{ marginLeft: 10 }} outline onClick={this.setRequests}><span className="fa fa-th-list fa-lg"></span> Requests</Button>
                    <Button color="primary" style={{ marginLeft: 10 }} outline onClick={this.setNewFriend}><span className="fa fa-user-plus fa-lg"></span> Add Contacts</Button>
                </ButtonGroup><div style={{ marginTop: 30 }}>
                    <div className="container">
                        <div className="row align-items-start">
                            <div className="col-12 col-md m-1">
                                <RenderAllPosts posts={this.state.allposts} h={this} />
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={h.state.isFriendsOpen} toggle={h.setFriends} onClosed={() => { window.location.reload(false); this.componentDidMount(); }}>
                    <ModalHeader toggle={h.setFriends}>Friends</ModalHeader>
                    <ModalBody>
                        <RenderAllFriends users={h.state.friends} here={h} />
                    </ModalBody>
                </Modal>


                <Modal size="lg" isOpen={h.state.isAddFriendsOpen} toggle={h.setNewFriend} onClosed={() => { window.location.reload(false); this.componentDidMount(); document.getElementById("username").value = ""; }}>
                    <ModalHeader toggle={h.setNewFriend}>Add a new friend</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label htmlFor="username">Search by Username</Label><br />
                                <Input type="search" id="username" name="username" value={h.state.username} onChange={h.handleInputChange} required />
                            </FormGroup>
                            <FormGroup>
                                <RenderAllUsers users={h.state.users} here={h} />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>

                <Modal isOpen={h.state.isRequestsOpen} toggle={h.setRequests} onClosed={() => { window.location.reload(false); this.componentDidMount(); }} >
                    <ModalHeader toggle={h.setRequests}>Requests</ModalHeader>
                    <ModalBody>
                        <RenderAllRequests users={h.state.requests} here={h} />
                    </ModalBody>
                </Modal>


            </>
        );
    }

}

export default withRouter(FeedComponent);