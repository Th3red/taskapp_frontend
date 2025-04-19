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
  }, [teamId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      requesterId: userId 
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
        dueDate: '' // reset due date
      });

      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-2">Assign a Task</h3>
      <form onSubmit={handleSubmit} className="grid gap-2">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="p-2 border rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded" />
        <input name="section" value={form.section} onChange={handleChange} placeholder="Section" className="p-2 border rounded" type="number" />
        <input name="assignmentNumber" value={form.assignmentNumber} onChange={handleChange} placeholder="Assignment Number" className="p-2 border rounded" type="number" />
        <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className="p-2 border rounded">
          <option value="">Select Member</option>
          {members.map(member => (
            <option key={member._id} value={member.username}>{member.username}</option>
          ))}
        </select>

        {/*duedate */}
        <input
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Assign</button>
      </form>
    </div>
  );
}

export default TaskForm;

