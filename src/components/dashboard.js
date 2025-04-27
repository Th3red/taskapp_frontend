import React, { useEffect, useState } from 'react';
import {PlusIcon,PlusCircleIcon, XMarkIcon} from '@heroicons/react/24/solid'; // yarn add @heroicons/react
import TeamInfo   from './teamInfo';
import AddMember  from './addMember';
import TaskForm   from './taskForm';
import KanbanBoard from './kanbanBoard';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);      // toggle refreshKey to re-load tasks
  const [isLead, setIsLead] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;
  const token   = localStorage.getItem('token');
  const teamId  = localStorage.getItem('teamId');
  const userId  = localStorage.getItem('userId');

  // flip refreshKey to trigger re-loading
  const handleTaskCreated = () => setRefreshKey(k => k + 1);
  
  // load summary tasks whenever teamId or refreshKey changes
  useEffect(() => {
    if (!teamId) return;
    fetch(`${API_URL}/progress/${teamId}`, {
      headers: { Authorization: token }
    })
      .then(r => r.json())
      .then(setTasks)
      .catch(console.error);
  }, [teamId, token, API_URL, refreshKey]);

  // check lead status
  useEffect(() => {
    if (!teamId || !userId) return;
    fetch(`${API_URL}/teams/${teamId}/members`, {
      headers: { Authorization: token }
    })
      .then(r => r.json())
      .then(data => {
        const me = data.members.find(m => m._id === userId);
        setIsLead(me?.role === 'lead');
      })
      .catch(console.error);
  }, [teamId, userId, token, API_URL]);
  if (!teamId) {
    return (
      <p className="text-center text-red-400 mt-4">
        Your not in a team yets.
      </p>
    );
  }
  // show add member form
  const toggleForm = () => {
    if (!isLead) {
      setErrorMsg('Only team leads can add members.');
      return;
    }
    setErrorMsg('');
    setShowAddMember(v => !v);
  };
  const toggleTaskForm = () => {
    setShowTaskForm(v => !v);
  };

  

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row gap-4 px-4">

        <div className="lg:w-1/3 space-y-6">
          <TeamInfo refreshKey={refreshKey}/>

          <button
            onClick={toggleTaskForm}
            className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white py-1 px-3 rounded flex items-center gap-1"
          >
            {showTaskForm ? (
            <>
              <XMarkIcon  className="w-5 h-5" />
              <span>Hide task form</span>
            </>
          ) : (
            <>
              <PlusCircleIcon className="w-5 h-5" />
              <span>Add task</span>
            </>
            )}
          </button>
          {showTaskForm && <TaskForm onTaskCreated={handleTaskCreated} />}

          <div>
            <button
              onClick={toggleForm}
              className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white py-1 px-3 rounded flex items-center gap-1"
            >
              {showAddMember ? (
                <>
                  <XMarkIcon className="w-5 h-5" />
                  <span>Add member</span>
                </>
              ) : (
                <>
                  <PlusCircleIcon className="w-5 h-5" />
                  <span>Add member</span>
                </>
              )}
            </button>
            {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
            {showAddMember && <AddMember />}
          </div>
        </div>

        <div className="flex-1 bg-gray-900 rounded-md p-4 text-gray-200 min-h-[60vh]">
          <KanbanBoard refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
