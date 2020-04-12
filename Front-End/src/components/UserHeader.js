import React, { Component } from 'react';
import {
    Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router'
import logo from "../images/logo.png";
class UserHeader extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {}
    }
    logout() {
        var h = this;
        fetch('/logout', {
            method: 'GET'
        })
            .then((res) => {
                if (res.status == 200) {
                    h.props.history.push("/home");
                }
                else {
                    alert("ERROR!!");
                }
            })
            .catch((err) => {
                alert(err);
            })
    }
    render() {
        return (
            <>
                <Navbar dark expand="md">
                    <div className="container">
                        <NavbarToggler />
                        <NavbarBrand className="mr-auto" href="/auth/search"><img src={logo} height="35" width="35" alt='V.I.B.E. Tech' /></NavbarBrand>
                        <Collapse navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link" to='/auth/search'><span className="fa fa-search-plus fab-lg"></span> Search</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/auth/feed'><span className="fa fa-info fa-lg"></span> FEED </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/auth/mypage'><span className="fa fa-user-circle fa-lg"></span> My Page</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/auth/recommendations'><span className="fa fa-address-card fa-lg"></span> Recommendations</NavLink>
                                </NavItem>
                                <NavItem>
                                    <Label style={{ marginLeft: 150, color: 'grey' }}> <h2><b>Welcome, {this.props.current}</b></h2></Label>
                                </NavItem>
                            </Nav>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <Button outline onClick={this.logout}><span className="fa fa-sign-out fa-lg"></span> Logout</Button>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>
            </>
        );
    }
}

export default withRouter(UserHeader);