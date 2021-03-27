import React, { Component } from 'react';
import { withRouter } from 'react-router';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Spinner, Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label, ButtonGroup
} from 'reactstrap';
import ReactDOM from "react-dom";
import Toast from "light-toast";
class UserPostsComponent extends Component {
    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.delete = this.delete.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.fetchUser = this.fetchUser.bind(this);
        this.setBio = this.setBio.bind(this);
        this.addToBio = this.addToBio.bind(this);
        this.state = {
            isModalOpen: false,
            isDeleteOpen: false,
            title: '',
            description: '',
            words: 0,
            myposts: [],
            error: '',
            postId: 0,
            bio: "",
            isViewCommentsOpen: false,
            allComments: [],
            isBioOpen: false
        }
    }
    componentDidMount() {
        this.myPosts();
        this.fetchUser();
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
    async setViewComments(pid) {
        let data = await this.viewComments(pid);
        this.setState({ isViewCommentsOpen: !this.state.isViewCommentsOpen, allComments: data });
    }
    addToBio() {
        var h = this;
        fetch("/users/" + this.props.current + "/bio", {
            method: "PUT",
            body: JSON.stringify({ bio: h.state.bio }),
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            }
        })
            .then((res) => {
                return res.json();
            })
            .catch(err => console.log(err));
    }
    deletePost() {
        fetch("/posts/" + this.props.current + "/" + this.state.postId, {
            method: 'DELETE',
            header: {
                'Content-Type': "application/json"
            }
        })
            .then((res) => {
                if (res.status == 200) {
                    window.location.reload(false);
                }
            })
            .catch(err => console.log(err));
    }
    delete() {
        this.setState({ isDeleteOpen: !this.state.isDeleteOpen });
    }
    onSubmit = (event) => {
        event.preventDefault();
        if (this.state.words < 150) {
            this.setState({ error: 'Please enter atleast 150 words worth of idea description!' });
        }
        else {
            fetch("/posts/" + this.props.current, {
                method: 'PUT',
                body: JSON.stringify({ "heading": this.state.title, "description": this.state.description }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({ isModalOpen: !(this.state.isModalOpen) });
                        window.location.reload(false);
                    }
                })
                .catch(err => console.log(err));
        }
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    handleInputChange = (event) => {
        const { value, name } = event.target;
        if (name == "description") {
            this.setState({ words: value.length });
        }
        this.setState({
            [name]: value
        });
    }
    myPosts() {
        fetch('/posts/' + this.props.current, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.body.length == 0) {
                    return null;
                }
                var x = data.body;
                this.setState(prevState => ({
                    myposts: x
                }));
            })
            .catch(err => console.log(err));
    }
    fetchUser() {
        var h = this;
        fetch('/users/' + this.props.current, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.user.length == 0) {
                    return null;
                }
                var x = data.user;
                h.setState({ bio: x.bio });
            })
            .catch(err => console.log(err));
    }
    setBio() {
        this.setState({ isBioOpen: !this.state.isBioOpen });
    }

    render() {
        if (this.state.myposts.length == 0) {
            return (<div>
                <>
                    <h2 style={{ marginTop: 150, marginRight: 10 }}>
                        No posts here!<ButtonGroup style={{ marginLeft: 10 }}>
                            <Button outline color="primary" onClick={this.toggleModal}><span className="fa fa-plus-circle fa-lg"></span> New Post</Button>
                            <Button outline color="primary" style={{ marginLeft: 10 }} onClick={this.setBio}><span className="fa fa-pencil-square-o fa-lg"></span> My Bio</Button>
                        </ButtonGroup>
                    </h2><div style={{ marginTop: 150 }}></div></>


                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} onClosed={() => { this.componentDidMount(); }}>
                    <ModalHeader toggle={this.toggleModal}>Post an Idea!</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label htmlFor="title">Caption</Label>
                                <Input type="text" id="title" name="title"
                                    value={this.state.title} onChange={this.handleInputChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="description">Idea <Label style={{ color: 'grey' }}>(min: 150 words)</Label></Label>
                                <Input type="textarea" rows="10" id="description" name="description"
                                    value={this.state.description} onChange={this.handleInputChange} required />
                            </FormGroup>
                            <Label style={{ color: 'grey' }}> <Label id="word-limit" style={{ color: this.state.words < 150 ? 'red' : 'green' }} >{this.state.words}</Label></Label>
                            <br /><Button type="submit" value="submit" color="primary">Post!</Button><br />

                        </Form>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.isBioOpen} toggle={this.setBio} onClosed={() => { this.componentDidMount(); }}>
                    <ModalHeader toggle={this.setBio}>My Bio</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Input id="bio" name="bio" type="textarea" rows="3" value={this.state.bio} onChange={this.handleInputChange} />
                            </FormGroup>
                            <ButtonGroup>
                                <Button size="sm" color="success" outline onClick={() => { this.addToBio(); this.setBio(); Toast.success("Bio successfully modified", 1000, () => { }); }}><span className="fa fa-check fa-lg"></span> Save</Button>
                                <Button size="sm" style={{ marginLeft: 10 }} color="danger" outline onClick={() => { this.setBio(); document.getElementById("bio").value = this.state.bio; }} ><span className="fa fa-times fa-lg"></span> Discard</Button>
                            </ButtonGroup>

                        </Form>


                    </ModalBody>

                </Modal>

            </div>
            );
        }
        function RenderAllComments({ h,pid }) {
            let comments = h.state.allComments;
            // console.log(comments);
            if(comments.length){
            return (<div className="container"> {comments.map((p) =>
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
            return (<div className="container">No Comments!</div>);
        }
        function RenderCard({ post, h }) {
            return (
                <CardBody>
                    <CardTitle>{post.heading}</CardTitle>
                    <CardSubtitle>Posted By: YOU </CardSubtitle>
                    <Button style={{ marginLeft: 800 }} outline color="danger" onClick={() => { h.setState({ postId: post._id }, () => { h.delete(); }); }} ><span className="fa fa-trash fa-lg"></span></Button>
                    <br /><br /><CardSubtitle style={{ marginLeft: 800 }}>{post.postedAt}</CardSubtitle>
                    <br /><CardText>{post.description}</CardText><br/>
                    <Button outline color="primary" onClick={() => { h.setViewComments(post._id);}}><span className="fa fa-list fa-lg"></span> View Comments</Button><br/>
                    <Modal isOpen={h.state.isViewCommentsOpen} toggle={() => {h.setViewComments(post._id);}}>
                        <ModalHeader toggle={() => {h.setViewComments(post._id);}}>Comments</ModalHeader>
                        <ModalBody>
                        <RenderAllComments h = {h} pid={post._id}/> 
                        </ModalBody>
                    </Modal>
                </CardBody>
            );

        }
        function RenderAll({ posts, h }) {
            var x = posts.map((p) =>
                <>
                    <Card>
                        <RenderCard post={p} h={h} />
                    </Card><br />
                </>
            );
            return (<div className="container"> {x} </div>);
        }
        return (
            <>
                <br />
                <h2>Your Posts</h2>
                <ButtonGroup style={{ marginRight: 840 }}>
                    <Button outline color="primary" onClick={this.toggleModal}><span className="fa fa-plus-circle fa-lg"></span> New Post</Button>
                    <Button outline color="primary" style={{ marginLeft: 10 }} onClick={this.setBio}><span className="fa fa-pencil-square-o fa-lg"></span> My Bio</Button>
                </ButtonGroup>


                <br /><br />
                <div className="container">
                    <div className="row align-items-start">
                        <div className="col-12 col-md m-1">
                            <RenderAll posts={this.state.myposts} h={this} />
                        </div>
                    </div>
                </div>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} onClosed={() => { this.componentDidMount(); }}>
                    <ModalHeader toggle={this.toggleModal}>Post an Idea!</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label htmlFor="title">Caption</Label>
                                <Input type="text" id="title" name="title"
                                    value={this.state.title} onChange={this.handleInputChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="description">Idea <Label style={{ color: 'grey' }}>(min: 150 words)</Label></Label>
                                <Input type="textarea" rows="10" id="description" name="description"
                                    value={this.state.description} onChange={this.handleInputChange} required />
                            </FormGroup>
                            <Label style={{ color: 'grey' }}> <Label id="word-limit" style={{ color: this.state.words < 150 ? 'red' : 'green' }} >{this.state.words}</Label></Label>
                            <br /><Button type="submit" value="submit" color="primary">Post!</Button><br />

                        </Form>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isDeleteOpen} toggle={this.delete} onClosed={() => { this.componentDidMount(); }}>
                    <ModalHeader toggle={this.delete}>Are you sure you want to delete this post?</ModalHeader>
                    <ModalBody>
                        <Button outline style={{ marginLeft: 150 }} onClick={this.deletePost}><span className="fa fa-check fa-lg"></span> YES</Button>
                        <Button outline style={{ marginLeft: 25 }} onClick={this.delete}><span className="fa fa-times fa-lg"></span> NO</Button>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isBioOpen} toggle={this.setBio} onClosed={() => { this.componentDidMount(); }}>
                    <ModalHeader toggle={this.setBio}>My Bio</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Input id="bio" name="bio" type="textarea" rows="3" value={this.state.bio} onChange={this.handleInputChange} />
                            </FormGroup>
                            <ButtonGroup>
                                <Button size="sm" color="success" outline onClick={() => { this.addToBio(); this.setBio(); Toast.success("Bio successfully modified", 1000, () => { }); }}><span className="fa fa-check fa-lg"></span> Save</Button>
                                <Button size="sm" style={{ marginLeft: 10 }} color="danger" outline onClick={() => { this.setBio(); document.getElementById("bio").value = this.state.bio; }} ><span className="fa fa-times fa-lg"></span> Discard</Button>
                            </ButtonGroup>

                        </Form>


                    </ModalBody>

                </Modal>

            </>
        );
    }
}

export default withRouter(UserPostsComponent);