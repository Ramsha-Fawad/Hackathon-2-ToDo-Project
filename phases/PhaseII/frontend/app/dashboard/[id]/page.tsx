'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { todoService, Todo } from '../../../services/todo-service';
import TodoForm from '../../../components/todos/TodoForm';
import LogoutButton from '../../../components/auth/LogoutButton';
import Link from 'next/link';

const TodoDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load todo on component mount
  useEffect(() => {
    if (id && typeof id === 'string') {
      loadTodo(id);
    }
  }, [id]);

  const loadTodo = async (todoId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const fetchedTodo = await todoService.getById(todoId);
      setTodo(fetchedTodo);
    } catch (err) {
      console.error('Error loading todo:', err);
      setError('Failed to load todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodo = async (todoData: any) => {
    if (!todo) return;

    try {
      setIsUpdating(true);
      const updatedTodo = await todoService.update(todo.id, todoData);
      setTodo(updatedTodo);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!todo) return;

    try {
      setIsUpdating(true);
      const updatedTodo = await todoService.toggleCompletion(todo.id);
      setTodo(updatedTodo);
    } catch (err) {
      console.error('Error toggling todo completion:', err);
      setError('Failed to update todo status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTodo = async () => {
    if (!todo || !window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await todoService.delete(todo.id);
      router.push('/dashboard');
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo. Please try again.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg mb-4">Please log in to access your dashboard</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Todo Detail</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name || user.email}</span>
              <LogoutButton variant="secondary" size="sm" />
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p>Loading todo...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Todo Detail</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name || user.email}</span>
              <LogoutButton variant="secondary" size="sm" />
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p>Todo not found.</p>
            <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Todo Detail</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.name || user.email}</span>
            <LogoutButton variant="secondary" size="sm" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={handleToggleComplete}
                disabled={isUpdating}
                className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="ml-4">
                <h2 className={`text-2xl font-bold ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {todo.title}
                </h2>
                {todo.description && (
                  <p className={`mt-2 text-lg ${
                    todo.completed ? 'line-through text-gray-500' : 'text-gray-600'
                  }`}>
                    {todo.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isUpdating}
                className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                title={isEditing ? 'Cancel Edit' : 'Edit'}
              >
                {isEditing ? (
                  <span>Cancel</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleDeleteTodo}
                disabled={isUpdating}
                className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-gray-900">{formatDate(todo.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-gray-900">{formatDate(todo.updatedAt)}</p>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Todo</h3>
              <TodoForm
                todo={todo}
                onSubmit={handleUpdateTodo}
                onCancel={() => setIsEditing(false)}
                submitText="Update Todo"
                isSubmitting={isUpdating}
              />
            </div>
          )}

          {!isEditing && (
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                ← Back to Dashboard
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TodoDetailPage;