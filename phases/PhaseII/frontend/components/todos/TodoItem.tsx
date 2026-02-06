'use client';

import { useState } from 'react';
import { useTasks } from '../../lib/hooks/useTasks';

interface TodoItemProps {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
}

export default function TodoItem({ id, title, description, completed, userId }: TodoItemProps) {
  const { updateTask, deleteTask, toggleTaskCompletion, loading } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || '');

  const handleToggle = async () => {
    try {
      await toggleTaskCompletion(id);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      alert('Failed to update task completion status. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleEdit = async () => {
    if (!editTitle.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    try {
      await updateTask(id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(title);
    setEditDescription(description || '');
    setIsEditing(false);
  };

  return (
    <li className="bg-white px-4 py-4 shadow sm:rounded-lg sm:px-6">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task description (optional)"
            rows={2}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              disabled={loading.updateTask}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading.updateTask ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id={`todo-${id}`}
              type="checkbox"
              checked={completed}
              onChange={handleToggle}
              disabled={loading.completeTask}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <label htmlFor={`todo-${id}`} className="text-sm font-medium text-gray-700">
              <span className={completed ? 'line-through text-gray-500' : ''}>{title}</span>
            </label>
            {description && (
              <p className={`text-sm ${completed ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                {description}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading.updateTask}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading.deleteTask}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}