import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { PencilSquareIcon } from '@heroicons/react/24/solid';    //  yarn add @heroicons/react
import EditTaskFormOverlay        from './EditTaskFormOverlay';


const Column = ({ title, children, bg }) => {
  const { isOver, setNodeRef } = useDroppable({ id: title });
  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col rounded-md text-gray-200 flex-1
        min-w-[8rem] max-h-[90vh] overflow-hidden shadow-inner
        ${bg || 'bg-gray-800'}
        ${isOver ? 'ring-4 ring-indigo-400' : ''}
      `}
    >
      <div className="px-2 py-1 border-b border-gray-700 text-sm font-medium">
        {title}
      </div>
      <div className="flex-1 overflow-y-auto p-1 space-y-1">
        {children}
      </div>
    </div>
  );
};


const TaskCard = ({ task, dragOverlay, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task._id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        position: dragOverlay ? 'fixed' : 'relative',
        pointerEvents: 'none',
      }
    : undefined;

  const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`
        bg-gray-700 rounded p-2 flex flex-col space-y-1 text-xs
        ${isDragging && !dragOverlay ? 'opacity-50' : 'opacity-100'}
        cursor-grab hover:bg-gray-600 transition
      `}
    >
      {/* title + edit button */}
      <div className="flex justify-between items-start space-x-1">
        <span className="font-medium truncate">{task.title}</span>

        <button
          className="text-gray-400 hover:text-indigo-400 shrink-0"

          onPointerDown={e => e.stopPropagation()}
          onClick={e => {
            e.stopPropagation();          // just in case
            onEdit(task);
          }}
        >
        <PencilSquareIcon className="w-4 h-4" />
      </button>

      </div>

      <div className="text-gray-300 line-clamp-2">{task.description}</div>

      {due && (
        <div className="mt-1 text-gray-400 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 2a1 1 0 000 2h1v1a1 1 0 102 0V4h2v1a1 1 0 102 0V4h1a1 1 0 100-2H6zM3 8a1 1 0 011-1h12a1 1 0 011 1v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          {due}
        </div>
      )}

      {task.assignedTo && (
        <div className="mt-1 text-gray-400 italic">
          {task.assignedTo.username}
        </div>
      )}
    </div>
  );
};


export default function KanbanBoard({ refreshKey }) {
  const [tasks,        setTasks]        = useState([]);
  const [activeId,     setActiveId]     = useState(null);
  const [editingTask,  setEditingTask]  = useState(null);

  const API   = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');
  const teamId= localStorage.getItem('teamId');

  const sensors = useSensors(useSensor(PointerSensor));


  useEffect(() => {
    if (!teamId) return;
    fetch(`${API}/progress/${teamId}`, { headers: { Authorization: token } })
      .then(r => r.json())
      .then(setTasks)
      .catch(console.error);
  }, [teamId, API, token, refreshKey]);


  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const newStatus = over.id;
    setTasks(ts => ts.map(t => (t._id === active.id ? { ...t, status: newStatus } : t)));

    fetch(`${API}/${active.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ status: newStatus, userId: localStorage.getItem('userId') }),
    }).catch(console.error);
  };


  const grouped = {
    Backlog     : tasks.filter(t => t.status === 'Backlog'),
    Todo        : tasks.filter(t => t.status === 'Todo'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    Completed   : tasks.filter(t => t.status === 'Completed'),
  };

  if (!teamId)
    return <p className="text-center text-red-400 mt-6">Your not in a team yet</p>;

  const activeTask = activeId && tasks.find(t => t._id === activeId);

  return (
    <div className="flex flex-col w-full h-full bg-gray-900 rounded-md p-4 text-gray-200">
      <h1 className="mt-2 w-full bg-gray-800 hover:bg-indigo-500 text-white py-3 px-4 rounded text-2xl font-bold">Kanban Board</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Object.entries(grouped).map(([status, list]) => (
            <Column key={status} title={status} bg="bg-gray-800">
              {list.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  dragOverlay={false}
                  onEdit={setEditingTask}
                />
              ))}
            </Column>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} dragOverlay /> : null}
        </DragOverlay>
      </DndContext>


      {editingTask && (
        <EditTaskFormOverlay
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={async updated => {
            await fetch(`${API}/tasks/${updated._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
              body: JSON.stringify({
                title:       updated.title,
                description: updated.description,
                dueDate:     updated.dueDate,
              }),
            }).catch(console.error);

            setTasks(ts =>
              ts.map(t => (t._id === updated._id ? { ...t, ...updated } : t))
            );
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
