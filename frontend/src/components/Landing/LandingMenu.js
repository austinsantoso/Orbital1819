import React from 'react';
import Axios from 'axios';
import { Container, Row, Col, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';

import './LandingMenu.css';

class LandingMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calendars: [],
      calendarsLoaded: false
    };

    this.getCalendars = this.getCalendars.bind(this);
    this.deleteCalendar = this.deleteCalendar.bind(this);
  }

  getCalendars() {
    if (JSON.stringify(this.props.userData) !== '{}') {
      Axios.get('http://localhost:5000/getCalendars/' + this.props.userData.id)
        .then(response => {
          this.setState({
            calendars: response.data,
            calendarsLoaded: true
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            calendarsLoaded: false
          });
        });
    }
  }

  deleteCalendar(code) {
    if (JSON.stringify(this.props.userData) !== '{}') {
      Axios.delete('http://localhost:5000/deleteCalendar/' + this.props.userData.id + '/' + code)
        .then(response => {
          this.getCalendars(code);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  componentWillMount() {
    this.getCalendars();
  }

  render() {
    const loginButtons = (
      <Row className="login justify-content-center">
        <Col lg="auto" className="text-center">
          <Button variant="outline-primary" className="px-5" href='/login'>Login</Button>
          <p className="text-center my-2"> or </p>
          <Button variant="outline-dark" className="px-5" href='/register'>Get Started</Button>
        </Col>
      </Row>
    );

    const noCalendars = (
      <Col lg={8} className="my-2 text-center">
        <p>You have no calendars</p>
        <Button variant="outline-dark">Create a new one!</Button>
      </Col>
    );

    const getCalendarsFailed = (
      <Col lg={8} className="my-2 text-center">
        <p>Sorry, there was an error in getting your calendars :(</p>
        <Button variant="outline-dark" onClick={this.getCalendars}>Try again</Button>
      </Col>
    );

    const createCalendarButton = calendar => {
      return (
        <Col key={calendar.code} lg={8} className="calendar my-2 text-center">
          <ButtonGroup>
            <Button variant="outline-dark" className="name" onClick={() => this.props.loadCalendar(calendar.code)}>{calendar.name}</Button>
            <Button variant="outline-danger" className="delete" onClick={() => this.deleteCalendar(calendar.code)}>Delete</Button>
          </ButtonGroup>
        </Col>
      );
    };

    return (
      <Container fluid className="landing-menu">
        <Row className="hello justify-content-center align-items-center">
          <Col lg={3} className="text-center">
            <h2>{this.props.userData.username ? 'Hello, ' + this.props.userData.username + '!' : 'Hello!'}</h2>
          </Col>
        </Row>

        {JSON.stringify(this.props.userData) === '{}' && loginButtons}

        <Row className="menu justify-content-center my-4">
          <Col lg={3} className="calendars right-border">
            <Row className="align-items-center flex-column pr-3">
              <Col lg={8} className="text-center">
                <h4 className="my-2">Your Calendars</h4>
              </Col>

              {
                this.state.calendarsLoaded
                  ? this.state.calendars.length > 0
                    ? this.state.calendars.map(createCalendarButton)
                    : noCalendars
                  : getCalendarsFailed
              }

            </Row>
          </Col>
          <Col lg={3} className="options left-border">
            <Row className="flex-column align-items-center pl-3">
              <Col lg={8} className="text-center">
                <h4 className="my-2">Add calendars</h4>
              </Col>
              <Col lg={8} className="text-center">
                <Button variant="outline-dark" className="my-2" onClick={this.props.showCreateCalendarModal}>Create New Calendar</Button>
              </Col>
              <Col lg={12} className="text-center">
                <InputGroup className="my-2">
                  <FormControl
                    placeholder="Calendar invite link"
                    aria-label="Calendar invite link"
                  />
                  <InputGroup.Append>
                    <Button variant="outline-dark" onClick={this.props.loadCalendar}>Import Calendar</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LandingMenu;