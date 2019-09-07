import React from 'react';
import Axios from 'axios';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';

import './AddEventModal.css';
import PlacesInput from '../Places/PlacesInput';

class AddEventModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: '',
      placeId: '',
      date: null,
      startTime: '',
      endTime: '',
      focused: null,
    }
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handlePlaceChange = (address, placeId) => {
    if (placeId) {
      this.setState({
        place: address,
        placeId: placeId,
      });
    }
  }

  handleSubmit = event => {
    const startSplitted = this.state.startTime.split(':', 2).map(x => parseInt(x, 10));
    const endSplitted = this.state.endTime.split(':', 2).map(x => parseInt(x, 10));
    const data = {
      id: this.state.placeId,
      title: this.state.place,
      start: moment(this.state.date).startOf('day').add({ hours: startSplitted[0], minutes: startSplitted[1] }).format('YYYY-MM-DD HH:mm:ss'),
      end: moment(this.state.date).startOf('day').add({ hours: endSplitted[0], minutes: endSplitted[1] }).format('YYYY-MM-DD HH:mm:ss'),
      comment: '',
    }

    Axios.post('http://localhost:5000/addEvent/' + this.props.calendarData.code + '/' + JSON.stringify(data))
      .then((res) => {
        this.props.toggleShow();
        this.props.getEvents(this.props.calendarData.code);
      })
      .catch(console.log);
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.toggleShow} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Add new event
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='form-eventPlace'>
              <Form.Label>Place Name</Form.Label>
              <PlacesInput
                value={this.state.place}
                onChange={place => this.setState({ place })}
                onSelect={this.handlePlaceChange}
              />
            </Form.Group>
            <Form.Group controlId='form-eventDate'>
              <Form.Label>Date</Form.Label>
              <Form.Row>
                <Col>
                  <SingleDatePicker
                    id="add_event_date"
                    date={this.state.date}
                    onDateChange={date => this.setState({ date })}
                    focused={this.state.focused}
                    onFocusChange={({ focused }) => this.setState({ focused })}
                    numberOfMonths={1}
                    isOutsideRange={day =>
                      !day.isBetween(this.props.calendarData.start_date, this.props.calendarData.end_date)
                    }
                  />
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Row>
              <Col lg={3}>
                <Form.Group controlId='form-eventStart'>
                  <Form.Label>From</Form.Label>
                  <Form.Control type="text" name="startTime" placeholder="HH:MM" onChange={this.handleChange} />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group controlId='form-eventEnd'>
                  <Form.Label>To</Form.Label>
                  <Form.Control type="text" name="endTime" placeholder="HH:MM" onChange={this.handleChange} />
                </Form.Group>
              </Col>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-success" onClick={this.handleSubmit}>Add</Button>
          <Button variant="outline-dark" onClick={this.props.toggleShow}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddEventModal;