import Header from './HeaderComponent';
import React, { Component } from 'react';
import {
    Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label
} from 'reactstrap';
class SearchEngine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }
    render() {
        return (
            <>
                <Header />
                <Form>
                    <FormGroup>
                        <br /><Label><h2>Register/Sign-In to use <br /><br /><b>V.I.B.E. </b><i>Search</i></h2></Label>
                    </FormGroup>
                </Form>
            </>
        );
    }
}

export default SearchEngine;