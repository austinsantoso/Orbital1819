import React from 'react';
import Axios from 'axios';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import PlacesInput from '../Places/PlacesInput';
import { geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';

import './CreateCalendarModal.css';
class CreateCalendarModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calendarName: '',
      destination: '',
      latLong: '',
      startDate: null,
      endDate: null,

      focusedInput: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handlePlaceChange = (address, placeId) => {
    if (placeId) {
      geocodeByPlaceId(placeId)
        .then(res => getLatLng(res[0]))
        .then(latlng => {
          this.setState({
            destination: address,
            latLong: latlng.lat + ',' + latlng.lng
          })
        })
        .catch(console.log);
    }
  }

  handleSubmit(event) {
    const data = {
      calendarName: this.state.calendarName,
      destination: this.state.destination,
      latLong: this.state.latLong,
      startDate: this.state.startDate.format('YYYY-MM-DD'),
      endDate: this.state.endDate.format('YYYY-MM-DD'),
    }

    Axios.post('http://localhost:5000/addCalendar/' + this.props.userData.id, data)
      .then((res) => {
        this.props.toggleShow();
        this.props.loadCalendar(res.data.calendarCode);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.toggleShow} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Create a new calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Trip Date</Form.Label>
            <Form.Row>
              <Col>
                <DateRangePicker
                  startDate={this.state.startDate}
                  startDateId='create_calendar_start_date'
                  endDate={this.state.endDate}
                  endDateId='create_calendar_end_date'
                  onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
                  focusedInput={this.state.focusedInput}
                  onFocusChange={focusedInput => this.setState({ focusedInput })}
                />
              </Col>
            </Form.Row>
          </Form.Group>
          <Form>
            <Form.Group>
              <Form.Label>Calendar Name</Form.Label>
              <Form.Control type="text" name="calendarName" placeholder="My awesome summer trip!" onChange={this.handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Destination</Form.Label>
              <PlacesInput
                value={this.state.destination}
                onChange={destination => this.setState({ destination })}
                onSelect={this.handlePlaceChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit}>Create</Button>
          <Button onClick={this.props.toggleShow}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CreateCalendarModal;