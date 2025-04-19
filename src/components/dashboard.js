import React, { useEffect, useState } from 'react';
import TeamInfo from './teamInfo';
import AddMember from './addMember';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLead, setIsLead] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const teamId = localStorage.getItem('teamId');

  const toggleForm = () => {
    if (!isLead) {
      setErrorMsg('Only team leads can add members.');
      return;
    }
    setErrorMsg('');
    setShowAddMember(!showAddMember);
  };


  useEffect(() => {
    if (!teamId) return;

    fetch(`${API_URL}/progress/${teamId}`, {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Error fetching tasks:', err));
  }, [teamId]);

  // Check if user is lead
  useEffect(() => {
    if (!teamId || !userId) return;

    fetch(`${API_URL}/teams/${teamId}/members`, {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        const member = data.members.find((m) =>
          m._id === userId || m.user === userId
        );
        setIsLead(member?.role === 'lead');
      })
      .catch((err) => console.error('Error checking role:', err));
  }, [teamId, userId]);

  const countByStatus = (status) =>
    tasks.filter((task) => task.status === status).length;

  return (
    <div className="p-4">
      <TeamInfo />

      <h2 className="text-xl font-semibold mb-4">Task Summary</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Not Started: {countByStatus('Not Started')}</li>
        <li>In Progress: {countByStatus('In Progress')}</li>
        <li>Completed: {countByStatus('Completed')}</li>
      </ul>

      {/* Always show button, show warning if not a lead */}
      <div className="mt-6">
        <button
          onClick={toggleForm}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {showAddMember ? 'Hide Add Member' : 'Add Member'}
        </button>

        {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}

        {showAddMember && isLead && (
          <div className="mt-4">
            <AddMember />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
