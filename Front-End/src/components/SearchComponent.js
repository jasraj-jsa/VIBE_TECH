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
    onSearch = (event) => {
        event.preventDefault();
        fetch('/search', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => console.log(res));
    }
    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }
    render() {
        return (
            <>
                <Form style={{ marginTop: 75 }} onSubmit={this.onSearch}>
                    <FormGroup>
                        <br /><Label><h2><b>V.I.B.E. </b><i>Search</i></h2></Label>
                    </FormGroup>
                    <FormGroup>
                        <Label><Input type="search" id="search" name="query" placeholder="Ideate now..." size="100" onChange={this.handleInputChange} value={this.state.query} /></Label>
                    </FormGroup>
                    <Button type="submit" value="search" color="primary">Search</Button><br /><br />
                </Form>
                <div style={{ marginTop: 50 }}></div>
            </>
        );
    }
}

export default SearchEngine;