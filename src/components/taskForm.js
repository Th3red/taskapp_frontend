import React, { useState, useEffect } from 'react';

function TaskForm({ onTaskCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    section: '',
    assignmentNumber: '',
    assignedTo: '',
    dueDate: ''
  });

  const [members, setMembers] = useState([]);
  const teamId = localStorage.getItem('teamId');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); 
  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    if (teamId) {
      fetch(`${API_URL}/teams/${teamId}/members`, {
        headers: { Authorization: token }
      })
        .then(res => res.json())
        .then(data => setMembers(data.members || []))
        .catch(err => console.error('Error fetching members:', err));
    }
  }, [teamId, API_URL, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  if (!teamId) {
    return (
      <p className="text-center text-red-400 mt-4">
        Your not in a team yets.
      </p>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      requesterId: userId,
      status: 'todo',
    };

    try {
      await fetch(`${API_URL}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(payload)
      });

      setForm({
        title: '',
        description: '',
        section: '',
        assignmentNumber: '',
        assignedTo: '',
        dueDate: ''
      });

      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  return (
    <div className="
  bg-gray-800 
  p-4 
  rounded-lg 
  shadow-inner 
  mb-4 
  text-gray-200
  space-y-3
">
      <h3 className="mt-2 bg-gray-700 hover:bg-indigo-500 text-white py-1 px-3 rounded">Assign a Task</h3>
      <form onSubmit={handleSubmit} className="grid gap-2">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="bg-gray-700 text-gray-200 placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="bg-gray-700 text-gray-200 placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input name="section" value={form.section} onChange={handleChange} placeholder="Section" className="bg-gray-700 text-gray-200 placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" type="number" min="0"/>
        <input name="assignmentNumber" value={form.assignmentNumber} onChange={handleChange} placeholder="Assignment Number" className="bg-gray-700 text-gray-200 placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" type="number" min="0" />
        <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className="bg-gray-700 text-gray-200 placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select Member</option>
          {members.map(member => (
            <option key={member._id} value={member.username}>{member.username}</option>
          ))}
        </select>

        <input
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          className="bg-gray-700 text-gray-200 placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button type="submit" className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white py-1 px-3 rounded">Assign</button>
      </form>
    </div>
  );
}

export default TaskForm;

