'use client';

import React, { useState } from 'react';
import { Todo } from '../../services/todo-service';
import { useAuth } from '../../context/AuthContext';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string) => Promise<void>;
  isDeleting?: string | null;
  isToggling?: string | null;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  onToggleComplete,
  isDeleting,
  isToggling
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editError, setEditError] = useState<string | null>(null);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear edit error when user starts typing
    if (editError) {
      setEditError(null);
    }
  };

  const validateEditForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (editData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm()) {
      return;
    }

    try {
      setEditError(null);
      await onUpdate({
        title: editData.title,
        description: editData.description
      });
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while updating the todo';
      setEditError(errorMessage);
      console.error('Error updating todo:', error);
    }
  };

  const handleToggleComplete = async () => {
    try {
      await onToggleComplete(todo.id);
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      // Optionally show a toast notification here
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
        // Optionally show a toast notification here
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`p-4 mb-3 rounded-lg shadow-sm border ${
      todo.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
    }`}>
      {isEditing ? (
        <div className="space-y-3">
          {editError && (
            <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm">
              <span className="font-medium">Error: </span>{editError}
            </div>
          )}

          <div>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              disabled={isDeleting === todo.id || isToggling === todo.id}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "edit-title-error" : undefined}
            />
            {errors.title && (
              <p id="edit-title-error" className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <textarea
              name="description"
              value={editData.description}
              onChange={handleEditChange}
              disabled={isDeleting === todo.id || isToggling === todo.id}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={isDeleting === todo.id || isToggling === todo.id}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 min-h-[44px] min-w-[44px]"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isDeleting === todo.id || isToggling === todo.id}
              className="px-4 py-2 bg-gray-300 rounded-md text-sm hover:bg-gray-400 disabled:opacity-50 min-h-[44px] min-w-[44px]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggleComplete}
              disabled={isDeleting === todo.id || isToggling === todo.id}
              className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 focus:outline-none"
              aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
            />

            <div className="ml-3 flex-1 min-w-0">
              <h3 className={`text-lg font-medium ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.title}
              </h3>

              {todo.description && (
                <p className={`mt-1 text-sm ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}

              <div className="mt-2 text-xs text-gray-500">
                <p>Created: {formatDate(todo.createdAt)}</p>
                <p>Updated: {formatDate(todo.updatedAt)}</p>
              </div>
            </div>

            <div className="flex space-x-1 ml-2">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isDeleting === todo.id || isToggling === todo.id}
                className="p-3 text-gray-500 hover:text-blue-600 disabled:opacity-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[44px]"
                title="Edit"
                aria-label="Edit todo"
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting === todo.id || isToggling === todo.id}
                className="p-3 text-gray-500 hover:text-red-600 disabled:opacity-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[44px]"
                title="Delete"
                aria-label="Delete todo"
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {(isDeleting === todo.id || isToggling === todo.id) && (
        <div className="mt-2 text-xs text-gray-500 italic flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      )}
    </div>
  );
};

export default TodoItem;