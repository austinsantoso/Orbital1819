import React from 'react';
import moment from 'moment';
import Axios from 'axios';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import Autocomplete from '../Map/Autocomplete';

class CreateCalendarModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calendarName: '',
      destination: '',
      destinationId:'',
      startDate: null,
      endDate: null,

      focusedInput: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    let destinationData = {
      destination: this.state.destination,
      destinationId: this.state.destinationId
    }
    const data = {
      userId: this.props.userData.id,
      calendarName: this.state.calendarName,
      destination: JSON.stringify(destinationData),
      startDate: moment(this.state.startDate).startOf("day").unix(),
      endDate: moment(this.state.endDate).endOf("day").unix(),
    }
    console.log(data)
    Axios.post('http://localhost:5000/addCalendar', data)
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

  handleSelect(address, placeId) {
    console.group("handle select create calendar")
    console.log(address)
    console.log(placeId)
    this.setState({
      destination: address,
      destinationId: placeId
    })
    console.groupEnd()
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
              {/*<Form.Control type="text" name="destination" placeholder="Bali" onChange={this.handleChange} />*/}
              <Form.Row>
                <Col>
                  <Autocomplete 
                    handleSelect = {this.handleSelect}
                    searchOptions = {{
                      types: ['(regions)']
                    }}
                  />
                </Col>
              </Form.Row>
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