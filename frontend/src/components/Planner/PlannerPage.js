import React from 'react';
import Axios from 'axios';
import moment from 'moment'
import { Container, Row, Col } from 'react-bootstrap';

import Header from './Header';
import Sidebar from './Sidebar';
import Calendar from './Calendar';
import PlannerModals from './PlannerModals';
import { classList } from '../helper';

import './PlannerPage.css';

class PlannerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: null,
      calendarData: null,
      showAddEventModal: false,

      eventDetail: {},
      showEventDetailModal: false,
    }

    this.getCalendarData = this.getCalendarData.bind(this);
    this.getEvents = this.getEvents.bind(this);

    this.handleShowEventDetail = this.handleShowEventDetail.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.toggleAddEventModal = this.toggleAddEventModal.bind(this);
    this.toggleEventDetailModal = this.toggleEventDetailModal.bind(this);
  }

  toggleAddEventModal() {
    this.setState({
      showAddEventModal: !this.state.showAddEventModal
    });
  }

  toggleEventDetailModal() {
    this.setState({
      showEventDetailModal: !this.state.showEventDetailModal
    });
  }

  handleShowEventDetail(eventId) {
    var event = this.state.events.filter(e => e.id === eventId);
    if (event.length) {
      this.setState({
        showEventDetailModal: true,
        eventDetail: event[0]
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.calendarCode !== state.prevCalendarCode) {
      return {
        calendarData: null,
        events: null,
        prevCalendarCode: props.calendarCode,
      }
    }

    return null;
  }

  handleResize(event) {
    const events = this.state.events;

    var data = events.map(curr =>
      parseInt(curr.id) === parseInt(event.id)
        ? Object.assign({}, curr, {
          id: event.id,
          title: event.title,
          start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
        })
        : curr
    );

    const finalData = { events: data };
    Axios.post('http://localhost:5000/updateEvent/' + this.props.calendarCode + '/' + JSON.stringify(finalData))
      .then(response => {
        this.getEvents(this.props.calendarCode);
      })
      .catch(err => {
        console.log(err);
      });
  }

  getCalendarData(code) {
    Axios.get('http://localhost:5000/getCalendarData/' + code)
      .then(response => {
        this.setState({
          calendarData: response.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getEvents(code) {
    Axios.get('http://localhost:5000/getEvents/' + code)
      .then((res) => {
        var allEvents = [];
        for (var i in res.data) {
          var event = res.data[i];
          allEvents.push({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            comment: event.comment,
            allDay: false
          })
        }

        this.setState({
          events: allEvents
        });
      }).catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    if (this.state.calendarData === null) {
      this.getCalendarData(this.props.calendarCode);
    }

    if (this.state.events === null) {
      this.getEvents(this.props.calendarCode);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.calendarData === null) {
      this.getCalendarData(this.props.calendarCode);
    }

    if (this.state.events === null) {
      this.getEvents(this.props.calendarCode);
    }
  }

  render() {
    if (this.state.calendarData === null || this.state.events === null) {
      return (
        <h4>Loading...</h4>
      );
    } else {
      return (
        <div className={classList('planner', this.props.showLandingPage && 'blurred')}>
          <Header userData={this.props.userData} setUserData={this.props.setUserData} toggleLanding={this.props.toggleLanding} />
          <Container fluid>
            <Row>
              <Col lg={2}>
                <Sidebar calendarData={this.state.calendarData} toggleAddEventModal={this.toggleAddEventModal} />
              </Col>
              <Col lg={10}>
                <Calendar
                  calendarData={this.state.calendarData}
                  events={this.state.events}
                  handleResize={this.handleResize}
                  handleShowEventDetail={this.handleShowEventDetail}
                />
              </Col>
            </Row>
          </Container>
          <PlannerModals
            calendarData={this.state.calendarData}
            showAddEventModal={this.state.showAddEventModal}
            toggleAddEventModal={this.toggleAddEventModal}
            getEvents={this.getEvents}

            showEventDetailModal={this.state.showEventDetailModal}
            toggleEventDetailModal={this.toggleEventDetailModal}
            eventDetail={this.state.eventDetail}
          />
        </div>
      );
    }
  }
}

export default PlannerPage;
