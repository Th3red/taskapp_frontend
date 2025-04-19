// actions/authActions.js

import actionTypes from '../constants/actionTypes';

const API_URL = process.env.REACT_APP_API_URL;

// Action creators
function userLoggedIn(username) {
  return {
    type: actionTypes.USER_LOGGEDIN,
    username,
  };
}

function logout() {
  return {
    type: actionTypes.USER_LOGOUT,
  };
}

// Submit login form
export function submitLogin(data) {
    return (dispatch) => {
      return fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Login failed');
          return res.json();
        })
        .then((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', data.username);
          localStorage.setItem('role', response.user.role);
          if (response.user?.team?._id) localStorage.setItem('teamId', response.user.team._id);
          if (response.user && response.user._id) {
            localStorage.setItem('userId', response.user._id);
          }
  
          dispatch(userLoggedIn(data.username));
        })
        .catch((err) => console.error('Login error:', err));
    };
  }
  

// Submit register form
export function submitRegister(data) {
  return (dispatch) => {
    return fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
      .then(() => {
        // Log in immediately after registering
        // redirect to dashboard
        //window.location.href = '/dashboard';
        dispatch(submitLogin(data));
      })
      .then(() => {
        window.location.href = '/dashboard';
      })
      .catch((err) => console.error('Register error:', err));
  };
}

// Logout
export function logoutUser() {
  return (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('teamId');
    dispatch(logout());
  };
}
