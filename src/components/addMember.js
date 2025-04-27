import React, { useState } from 'react';
import { PlusCircleIconn } from '@heroicons/react/24/solid'; 
function AddMember() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('member');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
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
    <div className="
  bg-gray-800
  p-4
  rounded-lg
  shadow-inner
  mt-4
  text-gray-200
  space-y-3"
>
      <h3 className="text-lg font-bold border-b border-gray-700 pb-2">Add Team Member</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Username"
          value={username}
          className="bg-gray-700 text-gray-200 placeholder-gray-400 p-2 rounded focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-gray-700 text-gray-200 p-2 rounded focus:ring-2 focus:ring-indigo-500"
        >
          <option value="member">Member</option>
          <option value="lead">Lead</option>
        </select>
        <button type="submit" className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white py-1 px-3 rounded">
          Add Member
        </button>
      </form>
      {message && <p className="text-sm mt-2 text-gray-700">{message}</p>}
    </div>
  );
}

export default AddMember;
