import React from 'react';
import Axios from 'axios';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
import Autocomplete from '../Map/Autocomplete';

const google = window.google;

class AddEventModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      placeId:'',
      date: null,
      startTime: '',
      endTime: '',
      focused: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    })
  }

  handleSelect(address, placeId) {
    console.group("handle select add event")
    this.setState({
      address: address,
      placeId: placeId,
    })
    console.log(address)
    console.log(placeId)
    console.groupEnd()
  }

  handleSubmit(event) {
      Axios.get('http://localhost:5000/getEvents/' + this.props.code).then((res) => {
        let allEvents = res.data;
        let newId = '';
        // get the last id;
        if (allEvents.length === 0) {
          newId = '0'; // this is redundant
        } else {
          newId =  '' + (parseInt(allEvents[allEvents.length - 1].id) + 1)
        }
        console.log(res.data)
        return newId
      }).then((newId) => {
        const startSplitted = this.state.startTime.split(':', 2).map(x => parseInt(x, 10));
        const endSplitted = this.state.endTime.split(':', 2).map(x => parseInt(x, 10));
        const data = {
          id: newId,
          title: this.state.address,
          placeId: this.state.placeId,
          start: moment(this.state.date).startOf('day').add({ hours: startSplitted[0], minutes: startSplitted[1] }).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(this.state.date).startOf('day').add({ hours: endSplitted[0], minutes: endSplitted[1] }).format('YYYY-MM-DD HH:mm:ss'),
          comment: '',
        }

        Axios.post('http://localhost:5000/addEvent/' + this.props.code + '/' + JSON.stringify(data))
          .then((res) => {
            console.log('success');
            this.props.toggleShow();
            this.props.getEvents(this.props.code);
          })
          .catch((err) => {
            if (err) {
              console.log(err);
            }
          });
      }).catch((err) => {
            if (err) {
              console.log(err);
            }
          })

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
              <Form.Row>
                <Col>
                 {/*<Form.Control type="text" name="place" onChange={this.handleChange} />*/}
                <Autocomplete
                  handleSelect={this.handleSelect}
                  searchOptions={{
                    location: new google.maps.LatLng(this.props.destinationLatLong),
                    radius: 50000,
                  }}/>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group controlId='form-eventDate'>
              <Form.Label>Date</Form.Label>
              <Form.Row>
                <Col>
                  <SingleDatePicker
                    date={this.state.date}
                    onDateChange={date => this.setState({ date })}
                    focused={this.state.focused}
                    onFocusChange={({ focused }) => this.setState({ focused })}
                    id="add_event_date"
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