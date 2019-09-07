import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import './Header.css';

class Header extends React.Component {
  handleLogout = () => {
    this.props.setUserData({});
  };

  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="header" sticky="top">
        <Navbar.Brand className="px-3" onClick={this.props.toggleLanding}>
          <img src="/logo.png" className="d-inline-block align-top" width="30" height="30" alt="VacayPlanner" />
          {' VacayPlanner'}
        </Navbar.Brand>
        <Nav className="ml-auto">
          <NavDropdown title={<Navbar.Text>Hello, <u>{this.props.userData.username}</u>!</Navbar.Text>} alignRight>
            <NavDropdown.Item onClick={this.props.toggleLanding}>Your calendars</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={this.handleLogout} className="text-danger">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;