import React, { useState } from 'react';
import { submitRegister } from '../actions/authActions';
import { useDispatch } from 'react-redux';
import { Form, Button } from 'react-bootstrap';

function Register() {
  const [details, setDetails] = useState({
    username: '',
    email: '',
    password: ''
  });

  const dispatch = useDispatch();

  const updateDetails = (event) => {
    setDetails({
      ...details,
      [event.target.id]: event.target.value
    });
  };

  const register = (event) => {
    event.preventDefault();
    dispatch(submitRegister(details));
  };

  return (
    <div className="register-container">
      <Form onSubmit={register} className='register-form bg-dark text-light p-4 rounded'>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            onChange={updateDetails}
            value={details.username}
            type="text"
            placeholder="Username"
            required
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            onChange={updateDetails}
            value={details.email}
            type="email"
            placeholder="Email"
            required
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={updateDetails}
            value={details.password}
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            required
          />
        </Form.Group>

        <Button type="submit">Register</Button>
      </Form>
    </div>
  );
}

export default Register;
