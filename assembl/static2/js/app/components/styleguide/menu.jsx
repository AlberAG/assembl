import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class Menu extends React.Component {
  render() {
    return (
      <ListGroup>
        <ListGroupItem className="menu-item" href="#buttons">Buttons</ListGroupItem>
        <ListGroupItem className="menu-item" href="#titles">Titles</ListGroupItem>
        <ListGroupItem className="menu-item" href="#icons">Icons</ListGroupItem>
        <ListGroupItem className="menu-item" href="#login">Login</ListGroupItem>
        <ListGroupItem className="menu-item" href="#dropdown">Dropdown</ListGroupItem>
        <ListGroupItem className="menu-item" href="#loader">Loader</ListGroupItem>
        <ListGroupItem className="menu-item" href="#error">Error</ListGroupItem>
        <ListGroupItem className="menu-item" href="#container">Container</ListGroupItem>
      </ListGroup>
    );
  }
}

export default Menu;