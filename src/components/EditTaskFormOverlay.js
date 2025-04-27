import React, { useState } from 'react';

export default function EditTaskFormOverlay({ task, onSave, onClose }) {
  const [title,       setTitle]       = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate,     setDueDate]     = useState(
    task.dueDate ? task.dueDate.substring(0, 10) : ''   // YYYY-MM-DD
  );

  const submit = e => {
    e.preventDefault();
    onSave({ ...task, title, description, dueDate });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={submit}
        className="bg-gray-800 text-gray-200 w-80 p-4 rounded-md space-y-3 shadow-xl"
      >
        <h3 className="text-lg font-semibold">Edit Task</h3>

        <input
          className="w-full p-2 bg-gray-700 rounded"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 bg-gray-700 rounded resize-none h-24"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          type="date"
          className="w-full p-2 bg-gray-700 rounded"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
