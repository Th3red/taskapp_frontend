import React, { useState } from 'react';

function AddMember() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('member');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');  // This is the requester
  const teamId = localStorage.getItem('teamId');
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/teams/${teamId}/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ username, role, userId }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(result.msg || 'Member added successfully!');
        setUsername('');
        setRole('member');
      } else {
        setMessage(result.msg || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error adding member:', err);
      setMessage('Server error');
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Add Team Member</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Username"
          value={username}
          className="p-2 border rounded w-full"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="member">Member</option>
          <option value="lead">Lead</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Add Member
        </button>
      </form>
      {message && <p className="text-sm mt-2 text-gray-700">{message}</p>}
    </div>
  );
}

export default AddMember;
