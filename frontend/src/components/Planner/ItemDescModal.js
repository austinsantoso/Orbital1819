import React from 'react';
import Axios from 'axios';
import { Modal, Form, Col, Button } from 'react-bootstrap';

class ItemDescModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		id: this.props.id,
		code: this.props.code,
		title: this.props.title,
		placeId: this.props.placeId,
		comment: this.props.comment,
    }

    this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
		if (!this.state.title && !this.state.comment) {
			console.log("null, so will not update")
		} else {
			console.group('update Item Desc')
			Axios.get('http://localhost:5000/getEvents/' + this.props.code)
			.then((res) => {
				let events = res.data
				var data = events.map(curr =>
					parseInt(curr.id) === parseInt(this.props.id)
							? Object.assign({}, curr, {
									title: this.state.title,
									comment: this.state.comment
								})
							: curr
					);
				console.log("data:", data)
				const finalData = {events: data}
				Axios.post('http://localhost:5000/updateEvent/' + this.props.calendarCode + '/' + JSON.stringify(finalData))
						.then((res) => {
							console.log('success');
							this.getEvents(this.props.calendarCode);
						})
						.catch((err) => {
							if (err) {
								console.log(err);
							}
						});
				console.groupEnd()
			})
		
		}
		this.props.toggleShow()
  }

	componentDidUpdate(prevProps) {
		console.log("checkstate", !this.state.id, " and ", parseInt(this.props.id) !== parseInt(this.state.id))
		if(!this.props.id) { //initiall is null so dont update

		} else if (!this.state.id || parseInt(this.props.id) !== parseInt(this.state.id)) {
			console.log("updating")
			this.setState({
				id: this.props.id,
				code: this.props.code,
				title: this.props.title,
				placeId: this.props.placeId,
				comment: this.props.comment,
			})
		}
	}

	
  render() {
		console.log("State:", this.state, "props:", this.props)
    return (
      <Modal show={this.props.show} onHide={this.props.toggleShow} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Item Description
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='form-eventPlace'>
              <Form.Label>Place Name</Form.Label>
              <Form.Control type="text" name="title" value={this.state.title} onChange={this.handleChange} />
            </Form.Group>
            <Form.Group controlId='form-eventDate'>
              <Form.Label>GOOGLE MAP API</Form.Label>
              <Form.Row>
                <Col>
                  THE GOOGLE MAP API FOR {this.state.placeId}
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
							<Form.Label>Comments</Form.Label>
							<Form.Control as="textarea" rows="3" name="comment" value={this.state.comment} onChange={this.handleChange} />
						</Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-success" onClick={this.handleSubmit}>Save Changes</Button>
          <Button variant="outline-dark" onClick={this.props.toggleShow}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ItemDescModal;