import React, { Component } from 'react';
import {
    Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
class Header extends Component {
    constructor(props) {
        super(props);

        this.toggleNav = this.toggleNav.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleSignUp = this.toggleSignUp.bind(this);
        this.clearError = this.clearError.bind(this);
        this.state = {
            isNavOpen: false,
            isModalOpen: false,
            username: '',
            password: '',
            error: '',
            isSignUpOpen: false,
            confirm: '',
            newUser: '',
            newPassword: ''
        };
    }
    toggleSignUp() {
        this.setState({
            isSignUpOpen: !this.state.isSignUpOpen
        });
    }
    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    clearError() {
        this.setState({ error: '' });
    }
    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        var h = this;
        fetch('/users/authenticate', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    h.props.history.push("/auth");
                } else {
                    this.setState({ error: 'Incorrect username or password!!' });
                }
            })
            .catch(err => {
                console.error(err);
                alert(err);
            });
    }
    onSignUp = (event) => {
        event.preventDefault();
        if (this.state.newPassword != this.state.confirm) {
            this.setState({ error: 'Passwords do not match!!' });
        }
        else {
            fetch('/users/register', {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    if (res.status == 400) {
                        this.setState({ error: 'Username already exists!' });
                    }
                    else if (res.status == 201) {
                        this.setState({ isSignUpOpen: false });
                        this.setState({ isModalOpen: true });
                        this.setState({ error: 'Registration Successful! Please LogIn to continue!' });
                    }
                    else {
                        console.log(res);
                    }
                })
                .catch(err => console.log(err));
        }
    }


    render() {
        return (
            <div>
                <Navbar dark expand="md">
                    <div className="container">
                        <NavbarToggler onClick={this.toggleNav} />
                        <NavbarBrand className="mr-auto" href="/"><img src='assets/images/logo.png' height="35" width="35" alt='V.I.B.E. Tech' /></NavbarBrand>
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link" to='/home'><span className="fa fa-home fa-lg"></span> Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/aboutus'><span className="fa fa-info fa-lg"></span> About Us</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/contact'><span className="fa fa-address-card fa-lg"></span> Contact Us</NavLink>
                                </NavItem>
                            </Nav>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <Button outline onClick={this.toggleModal}><span className="fa fa-sign-in fa-lg"></span> Login</Button>
                                </NavItem>
                            </Nav>
                            <Nav style={{ margin: 10 }} navbar>
                                <NavItem>
                                    <Button outline onClick={this.toggleSignUp}><span className="fa fa-user fa-lg"></span> Register</Button>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>
                <Jumbotron>
                    <div className="container">
                        <div className="row row-header">
                            <div className="col-12 col-sm-6">
                                <h1>V.I.B.E.</h1>
                                <p>Visionary Idea Browsing Environment is designed for all budding entrepreneurs across the globe. Its specifically designed for people who want to invent something of their own, the one who believe in developing something from scratch. </p>
                            </div>
                        </div>
                    </div>
                </Jumbotron>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username" onClick={this.clearError} onKeyUp={this.clearError}
                                    value={this.state.username} onChange={this.handleInputChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password" onClick={this.clearError} onKeyUp={this.clearError}
                                    value={this.state.password} onChange={this.handleInputChange} required />
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input type="checkbox" name="remember" />
                                    Remember me
                                </Label><br />
                            </FormGroup>
                            <br /><Button type="submit" value="submit" color="primary">Login</Button><br />
                            <br /><Label id="error" style={{ color: 'red' }}>{this.state.error}</Label>
                        </Form>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isSignUpOpen} toggle={this.toggleSignUp}>
                    <ModalHeader toggle={this.toggleSignUp}>V.I.B.E Ideator Registration</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSignUp}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="newUser" onClick={this.clearError} onKeyUp={this.clearError}
                                    value={this.state.newUser} onChange={this.handleInputChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="newPassword" onClick={this.clearError} onKeyUp={this.clearError}
                                    value={this.state.newPassword} onChange={this.handleInputChange} required />
                            </FormGroup>
                            <Label htmlFor="confirm"> Confirm Password</Label>
                            <Input type="password" id="confirm" name="confirm" onClick={this.clearError} onKeyUp={this.clearError}
                                value={this.state.confirm} onChange={this.handleInputChange} required />
                            <br /><Button type="submit" value="submit" color="primary">Register Now!</Button><br />
                            <br /><Label id="error" style={{ color: 'red' }}>{this.state.error}</Label>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default withRouter(Header);