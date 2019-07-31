import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import './Header.css';

class Header extends React.Component {
  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="header" sticky="top">
        <Navbar.Brand className="px-3">
          <div onClick={this.props.toggleLanding} style={{cursor:"pointer"}}>
          <img src="/logo.png" className="d-inline-block align-top" width="30" height="30" alt="VacayPlanner" />
          {' VacayPlanner'}
          </div>
        </Navbar.Brand>
        <Nav className="ml-auto">
          <NavDropdown title={<Navbar.Text>Hello, <u>{this.props.userData.username}</u>!</Navbar.Text>} alignRight>
            <NavDropdown.Item onClick={this.props.toggleLanding}>Your calendars</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/logout" className="text-danger">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;