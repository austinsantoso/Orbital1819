import React from 'react';

import LandingPage from './components/Landing/LandingPage';
import PlannerPage from './components/Planner/PlannerPage';

import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLandingPage: true,
      lastViewedCalendarCode: ''
    };

    this.toggleLanding = this.toggleLanding.bind(this);
    this.loadCalendar = this.loadCalendar.bind(this);
  }

  componentWillMount() {
    if (localStorage.getItem('lastViewedCalendarCode') == null) {
      localStorage.setItem('lastViewedCalendarCode', '');
    }

    let lastViewedCalendarCode = localStorage.getItem('lastViewedCalendarCode');

    this.setState({
      showLandingPage: lastViewedCalendarCode === '',
      lastViewedCalendarCode: lastViewedCalendarCode
    });
  }

  toggleLanding() {
    this.setState({
      showLandingPage: !this.state.showLandingPage
    });
  }

  loadCalendar(code) {
    console.log('loadCalendar fired, code:', code);
    localStorage.setItem('lastViewedCalendarCode', code);
    this.setState({
      showLandingPage: false,
      lastViewedCalendarCode: code
    });
  }

  render() {
    return (
      <div className="App">
        <LandingPage
          userData={this.props.userData}
          showLandingPage={this.state.showLandingPage}
          toggleLanding={this.toggleLanding}
          loadCalendar={this.loadCalendar}
        />

        <PlannerPage
          userData={this.props.userData}
          setUserData={this.props.setUserData}
          calendarCode={this.state.lastViewedCalendarCode}
          showLandingPage={this.state.showLandingPage}
          toggleLanding={this.toggleLanding}
        />
      </div>
    );
  }
}

export default App;
