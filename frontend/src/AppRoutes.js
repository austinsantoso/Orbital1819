import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './App';
import TimelineContainer from './components/Timeline/TimelineContainer';
import NotFound from './components/Routes/NotFound';
import Timeline from './components/Timeline/TimelineMain';
import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Login/RegisterPage';
import Home from './components/Home';

class AppRoutes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {
        id: 0,
        username: '',
      }
    }

    this.setUserData = this.setUserData.bind(this);
  }

  setUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
    this.setState({
      userData: data
    });
  }

  componentWillMount() {
    if (localStorage.getItem('userData') == null) {
      localStorage.setItem('userData', '{}');
    }

    this.setState({
      userData: JSON.parse(localStorage.getItem('userData'))
    });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={() => <App userData={this.state.userData} setUserData={this.setUserData} />} />
          <Route path="/newTimeline" component={TimelineContainer} />
          <Route path="/v1" render={() => <Home username={this.state.username} />} />
          <Route path='/event/:id' render={(props) => <Timeline {...props} username={this.state.username} />} />
          <Route path="/login" render={() => <LoginPage setUserData={this.setUserData} />} />
          <Route path="/register" render={() => <RegisterPage setUserData={this.setUserData} />} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default AppRoutes;