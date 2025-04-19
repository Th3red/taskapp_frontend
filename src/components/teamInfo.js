// src/components/TeamInfo.js
import React, { useEffect, useState } from 'react';

function TeamInfo() {
  const [teamInfo, setTeamInfo] = useState(null);
  const teamId = localStorage.getItem('teamId');
  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!teamId) return;

    fetch(`${API_URL}/teams/${teamId}/members`, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then(setTeamInfo)
      .catch((err) => console.error('Failed to fetch team info:', err));
  }, [teamId, API_URL, token]);

  if (!teamInfo) return null;

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-bold mb-2">Team Info</h2>
      <p><strong>Name:</strong> {teamInfo.name}</p>
      <p><strong>Description:</strong> {teamInfo.description}</p>
      <p><strong>Lead:</strong> {teamInfo.lead?.username}</p>
      <p><strong>Members:</strong></p>
      <ul className="list-disc list-inside">
        {teamInfo.members.map((m) => (
          <li key={m._id}>
            {m.username} {m.role === 'lead' && <span className="text-blue-600">(Lead)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamInfo;
