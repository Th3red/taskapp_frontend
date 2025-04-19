import React, { useState } from 'react';

function CreateTeam() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    members: '' // comma-separated usernames
  });

  const [message, setMessage] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');
  const leadId = localStorage.getItem('userId');
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload exactly as the backend expects
    const payload = {
      name: form.name,
      description: form.description,
      leadId: leadId,
      members: form.members, // send as a comma-separated string (backend handles conversion)
    };

    try {
      const response = await fetch(`${API_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Team "${result.name}" created!`);
        localStorage.setItem('teamId', result._id); // save for later use
        setForm({ name: '', description: '', members: '' });
      } else {
        setMessage(result.msg || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error creating team:', err);
      setMessage('Server error. Please try again.');
    }
  };

  return (
    <div className="create-team-form bg-white p-4 rounded shadow">
      <h2>Create a Team</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          name="name"
          type="text"
          placeholder="Team Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Team Description"
          value={form.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="members"
          type="text"
          placeholder="Member usernames (comma-separated)"
          value={form.members}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Create Team</button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}

export default CreateTeam;

