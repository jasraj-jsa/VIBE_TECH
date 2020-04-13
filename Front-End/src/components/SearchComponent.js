import React, { Component } from 'react';
import {
    Button, Form, FormGroup, Input, Label, CardLink, Card, CardText, CardBody,
    CardTitle,
} from 'reactstrap';
class SearchEngine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            ideas: [],
            problems: [],
            flag: 0
        }
    }
    onSearch = (event) => {
        event.preventDefault();
        fetch('/search', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json"
            }
        })
            .then((res) => {
                if (res.status == 200)
                    return res.json();
            })
            .then((data) => {
                this.setState({ ideas: data.output.ideas, problems: data.output.problems });
            })
            .catch((err) => console.log(err));
    }
    handleInputChange = (event) => {
        this.setState({ flag: 0 });
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }
    render() {
        function RenderSearch({ search }) {
            return (
                <CardBody>
                    <CardTitle>{search.title}</CardTitle>
                    <br /><br /><CardLink href={search.link}>{search.link}</CardLink>
                    <br /><CardText>{search.snippet}</CardText>
                </CardBody>
            );

        }
        function RenderAllSearches({ searches, flag, here, out }) {
            if (flag == 0 || searches.length == 0)
                return null;
            var x = searches.map((s) =>
                <>
                    <Card>
                        <RenderSearch search={s} />
                    </Card><br />
                </>
            );
            if (out == "idea")
                var st = <h2>{"Ideas related to " + here.state.query}</h2>;
            else
                var st = <h2>{"Problems associated with " + here.state.query}</h2>;
            return (<>{st}<br /><div className="container"> {x} </div></>);
        }
        return (
            <>
                <Form style={{ marginTop: 75 }} onSubmit={this.onSearch}>
                    <FormGroup>
                        <br /><Label><h2><b>V.I.B.E. </b><i>Search</i></h2></Label>
                    </FormGroup>
                    <FormGroup>
                        <Label><Input type="search" id="search" name="query" placeholder="Ideate now..." size="100" onChange={this.handleInputChange} value={this.state.query} /></Label>
                    </FormGroup>
                    <Button type="submit" value="search" color="primary" onClick={() => { this.setState({ flag: 1 }); }} >Search</Button><br /><br />
                </Form>
                <RenderAllSearches searches={this.state.ideas} flag={this.state.flag} here={this} out="idea" /><br /><br />
                <RenderAllSearches searches={this.state.problems} flag={this.state.flag} here={this} out="problem" />
                <div style={{ marginTop: 50 }}></div>
            </>
        );
    }
}

export default SearchEngine;