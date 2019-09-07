import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Axios from 'axios';
import { Draggable } from '@fullcalendar/interaction';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      suggestionsLoaded: false
    };

    this.getSuggestions = this.getSuggestions.bind(this);
  }

  getSuggestions() {
    if (JSON.stringify(this.props.calendarData) !== '{}') {
      Axios.get('http://localhost:5000/getSuggestions/' + this.props.calendarData.lat_lng)
        .then(response => {
          this.setState({
            suggestions: response.data,
            suggestionsLoaded: true
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            suggestionsLoaded: false
          });
        });
    }
  }

  componentWillMount() {
    this.getSuggestions();
  }

  componentDidMount() {
    const sidebar = document.getElementById('sidebar');
    new Draggable(sidebar, {
      itemSelector: ".sidebar-suggestion",
      eventData: e => {
        return {
          id: e.getAttribute("placeId"),
          title: e.getAttribute("title")
        };
      }
    });
  }

  render() {
    const createSuggestionButton = suggestion => (
      <Col key={suggestion.id} className="my-2 text-center sidebar-suggestion" title={suggestion.name} placeid={suggestion.id}>
        <Button variant="outline-primary" className="btn-block">{suggestion.name}</Button>
      </Col>
    );

    const noSuggestions = (
      <Col className="my-2 text-center">
        <p>No suggestions yet...</p>
        <Button variant="outline-primary" onClick={this.getSuggestions}>Get Suggestions</Button>
      </Col>
    );

    return (
      <Row className="side-nav flex-column align-items-center" id="sidebar">
        <Col className="my-2 text-center">
          <h4>{this.props.calendarData.name}</h4>
        </Col>
        <Col className="my-2 text-center">
          <Button variant="outline-primary" onClick={this.props.toggleAddEventModal}>Add new event</Button>
        </Col>
        <Col>
          <hr></hr>
        </Col>
        <Col className="text-center">
          <h6>Suggestions for you</h6>
        </Col>

        {
          this.state.suggestionsLoaded
            ? this.state.suggestions.length
              ? this.state.suggestions.map(createSuggestionButton)
              : noSuggestions
            : noSuggestions
        }
      </Row>
    );
  }
}

export default Sidebar;