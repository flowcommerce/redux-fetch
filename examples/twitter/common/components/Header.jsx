import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => (
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand>Twitter</Navbar.Brand>
    </Navbar.Header>
    <Nav bsStyle="pills">
      <LinkContainer to="/timeline">
        <NavItem>Home</NavItem>
      </LinkContainer>
      <LinkContainer to="/moments">
        <NavItem>Moments</NavItem>
      </LinkContainer>
      <LinkContainer to="/notifications">
        <NavItem>Notifications</NavItem>
      </LinkContainer>
      <LinkContainer to="/messages">
        <NavItem>Messages</NavItem>
      </LinkContainer>
    </Nav>
  </Navbar>
);

Header.displayName = 'Header';

export default Header;
