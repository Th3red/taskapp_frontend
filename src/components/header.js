// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../actions/authActions';

function Header() {
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const username = useSelector((state) => state.auth.username);

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">
          Task Manager
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">

            {loggedIn ? (
              <>
                <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={NavLink} to="/kanban">Kanban Board</Nav.Link>
                <Nav.Link as={NavLink} to="/createteam">Create Team</Nav.Link>
                <Nav.Link as={NavLink} to="/taskform">New Task</Nav.Link>

                <NavDropdown title={`${username}`} id="user-nav-dropdown" align="end">
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/signin">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
