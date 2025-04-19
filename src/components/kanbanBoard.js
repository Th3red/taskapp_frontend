// src/components/KanbanBoard.js
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, useDroppable, useDraggable } from '@dnd-kit/core';

const Column = ({ title, children }) => {
  const { setNodeRef } = useDroppable({ id: title });
  return (
    <div
      className="flex-1 bg-gray-100 p-2 rounded mx-1 min-h-[200px] max-h-[70vh] overflow-y-auto shadow-md w-[300px]"
      ref={setNodeRef}
    >
      <h3 className="font-bold text-md mb-2 text-center">{title}</h3>
      {children}
    </div>
  );
};


const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: task._id });
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : 'No due date';

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-white border rounded p-2 mb-2 shadow-sm text-sm hover:shadow-md transition"
    >
      <p className="font-semibold truncate">{task.title}</p>
      <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
      <p className="text-xs text-red-500 mt-1">Due: {formattedDate}</p>
      {task.assignedTo && (
        <p className="text-xs italic text-gray-500">
          {task.assignedTo.username}
        </p>
      )}
    </div>
  );
};


function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const teamId = localStorage.getItem('teamId'); 

  useEffect(() => {
    if (!teamId) return;
  
    fetch(`${API_URL}/progress/${teamId}`, {
      headers: { Authorization: token },
    })
      .then(res => res.json())
      .then(setTasks)
      .catch(err => console.error('Failed to load tasks', err));
  }, [teamId]);
  
  const handleDragStart = (event) => {
    setActiveTaskId(event.active.id);
  };
  
  const handleDragEnd = async (event) => {
    const { over } = event;
    if (!over) return;
  
    const newStatus = over.id;
    const taskToMove = tasks.find(t => t._id === activeTaskId);
    if (!taskToMove) return;
  
    const taskOwnerId = taskToMove.assignedTo?._id || taskToMove.assignedTo;
  
    try {
      // Fetch the team members with roles
      const res = await fetch(`${API_URL}/teams/${teamId}/members`, {
        headers: { Authorization: token },
      });
      const teamData = await res.json();
  
      const currentUser = teamData.members.find(
        (m) => m._id === userId || m.user === userId
      );
  
      const isOwner = taskOwnerId === userId;
      const isLead = currentUser?.role === 'lead';
  
      if (!isOwner && !isLead) {
        alert('You can only move your own tasks unless you are a lead.');
        return;
      }
  
      const updatedTasks = tasks.map(task =>
        task._id === activeTaskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
  
      await fetch(`${API_URL}/${activeTaskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          status: newStatus,
          userId,
        }),
      });
  
    } catch (err) {
      console.error('Error validating drag permissions:', err);
    }
  };
  
  

  const grouped = {
    'Not Started': tasks.filter(t => t.status === 'Not Started'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Completed': tasks.filter(t => t.status === 'Completed'),
  };
  if (!teamId) {
    return (
      <div className="p-4">
        <p className="text-center text-red-500">
          You are not assigned to a team. Please join or create a team first.
        </p>
      </div>
    );
  }
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Kanban Board</h2>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4">
          {Object.entries(grouped).map(([status, list]) => (
            <Column key={status} title={status}>
              {list.map(task => <TaskCard key={task._id} task={task} />)}
            </Column>
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
