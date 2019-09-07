import React from 'react';

import HomeNoLogin from './Login/HomeNoLogin';
import HomeLogin from './Login/HomeLogin';

import './homestyle.css';

class Home extends React.Component {
  render() {
    if (!this.props.username) {
      // User not logged in
      return <HomeNoLogin />;
    } else {
      // User has logged in
      return <HomeLogin username={this.props.username} />;
    }
  }
}

export default Home;