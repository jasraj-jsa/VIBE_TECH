import React, { Component } from 'react';
import {
    Button, Form, FormGroup, Input, Label, CardLink, Card, CardText, CardBody,
    CardTitle, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, CardSubtitle
} from 'reactstrap';
import classnames from 'classnames';
class SearchEngine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            ideas: [],
            problems: [],
            flag: 0,
            activeTab: 1,
            VIBEIdeas: []
        }
    }
    onSearch = (event) => {
        event.preventDefault();
        fetch('/search', {
            method: 'POST',
            body: JSON.stringify({query:this.state.query}),
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
    onVIBESearch = (event) => {
        event.preventDefault();
        fetch('/search/VIBESearch', {
            method: 'POST',
            body: JSON.stringify({query:this.state.query}),
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json"
            }
        })
            .then((res) => {
                if (res.status == 200)
                    return res.json();
                return {}
            })
            .then((data) => {
                this.setState({ VIBEIdeas: data.output });
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
    toggleTab(tab){
        if(this.state.activeTab !== tab) this.setState({activeTab: tab});
      }
    render() {
        function RenderSearch({ search,type }) {
            if(type==1){
            return (
                <CardBody>
                    <CardTitle>{search.title}</CardTitle>
                    <br /><br /><CardLink href={search.link}>{search.link}</CardLink>
                    <br /><CardText>{search.snippet}</CardText>
                </CardBody>
            );
            }
            return (
                <CardBody>
                    <CardTitle><b>{search.heading}</b></CardTitle>
                    <CardSubtitle>Posted By: {search.username} </CardSubtitle>
                    <br /><CardText>{search.description}</CardText>
                </CardBody>
            );

        }
        function RenderAllSearches({ searches, flag, here, out,type }) {
            if (flag == 0 || searches.length == 0){
                if(flag)
                return <><br/><br/><b>No Results Found!</b></>
                return null;
            }
            var x = searches.map((s) =>
                <>
                    <Card>
                        <RenderSearch search={s} type={type}/>
                    </Card><br />
                </>
            );
            if(type==1){
            if (out == "idea")
                var st = <h2>{"Ideas related to " + here.state.query}</h2>;
            else
                var st = <h2>{"Problems associated with " + here.state.query}</h2>;}
            return (<>{st}<br /><div className="container"> {x} </div></>);

        }
        return (
            <>
            <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === 1 })}
            onClick={() => { this.toggleTab(1); }}
          >
            Global Search Engine
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === 2 })}
            onClick={() => { this.toggleTab(2); }}
          >
            V.I.B.E Search
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={this.state.activeTab}>
        <TabPane active tabId={1}>
          <Row>
            <Col sm="12">
            <Form style={{ marginTop: 75 }} onSubmit={this.onSearch}>
                    <FormGroup>
                        <br /><Label><h2><b>Global </b><i>Search</i></h2></Label>
                    </FormGroup>
                    <FormGroup>
                        <Label><Input type="search" id="search" name="query" placeholder="Ideate now..." size="100" onChange={this.handleInputChange} value={this.state.query} /></Label>
                    </FormGroup>
                    <Button type="submit" value="search" color="primary" onClick={() => { this.setState({ flag: 1 }); }} >Search</Button><br /><br />
                </Form>
                <RenderAllSearches searches={this.state.ideas} flag={this.state.flag} here={this} out="idea" type={1} /><br /><br />
                <RenderAllSearches searches={this.state.problems} flag={this.state.flag} here={this} out="problem"  type={1}/>
                <div style={{ marginTop: 50 }}></div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId={2}>
          <Row>
            <Col sm="12">
            <Form style={{ marginTop: 75 }} onSubmit={this.onVIBESearch}>
                    <FormGroup>
                        <br /><Label><h2><b>V.I.B.E </b><i>Search</i></h2></Label>
                    </FormGroup>
                    <FormGroup>
                        <Label><Input type="search" id="search" name="query" placeholder="Ideate now..." size="100" onChange={this.handleInputChange} value={this.state.query} /></Label>
                    </FormGroup>
                    <Button type="submit" value="search" color="primary" onClick={() => { this.setState({ flag: 1 }); }} >Search</Button><br /><br />
                </Form>
                <RenderAllSearches searches={this.state.VIBEIdeas} flag={this.state.flag} here={this} out="idea" type={2}/><br /><br />
                <div style={{ marginTop: 50 }}></div>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>





                
            </>
        );
    }
}

export default SearchEngine;