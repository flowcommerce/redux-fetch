import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

export const Header = (props) => (
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand>Twitter</Navbar.Brand>
    </Navbar.Header>
    <Nav bsStyle="pills" onSelect={props.onRequestNavigation}>
      <NavItem eventKey={1} href="/timeline">Home</NavItem>
      <NavItem eventKey={2} href="/moments">Moments</NavItem>
      <NavItem eventKey={3} href="/notifications">Notifications</NavItem>
      <NavItem eventKey={4} href="/messages">Messages</NavItem>
    </Nav>
  </Navbar>
);

function mapDispatchToProps(dispatch) {
  return {
    onRequestNavigation(selectedKey, event) {
      dispatch(push(event.target.pathname));
    },
  };
}

export default connect(null, mapDispatchToProps)(Header);
