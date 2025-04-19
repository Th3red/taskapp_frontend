// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Header from './components/header';
import Login from './components/login';
import Register from './components/register';
import TaskForm from './components/taskForm';
import Dashboard from './components/dashboard';
import CreateTeam from './components/createTeam';
import KanbanBoard from './components/kanbanBoard';

function App() {
  const { loggedIn } = useSelector((state) => state.auth);

  return (
    <>
      <Header />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={loggedIn ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/taskform" element={loggedIn ? <TaskForm /> : <Navigate to="/signin" />} />
          <Route path="/createteam" element={loggedIn ? <CreateTeam /> : <Navigate to="/signin" />} />
          <Route path="/kanban" element={loggedIn ? <KanbanBoard /> : <Navigate to="/signin" />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
