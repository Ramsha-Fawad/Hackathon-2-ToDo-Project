'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { todoService, Todo, CreateTodoInput, UpdateTodoInput } from '../../services/todo-service';
import TodoForm from '../../components/todos/TodoForm';
import TodoItem from '../../components/todos/TodoItem';
import LogoutButton from '../../components/auth/LogoutButton';
import Link from 'next/link';
import EmptyState from '../../components/todos/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import DarkModeToggle from '../../components/ui/DarkModeToggle';

const DashboardPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'a-z' | 'z-a'>('newest');

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Apply filtering and sorting when todos change
  useEffect(() => {
    let result = [...todos];

    // Apply filter
    if (filter === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'a-z':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFilteredTodos(result);
  }, [todos, filter, sortOption]);

  const loadTodos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const fetchedTodos = await todoService.getAll();
      setTodos(fetchedTodos);
    } catch (err) {
      console.error('Error loading todos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load todos. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Implement todo creation functionality with API call
  const handleCreateTodo = async (todoData: CreateTodoInput | UpdateTodoInput) => {
    try {
      setIsCreating(true);
      setError(null); // Clear previous errors
      const newTodo = await todoService.create(todoData as CreateTodoInput);
      setTodos(prev => [newTodo, ...prev]);
    } catch (err) {
      console.error('Error creating todo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create todo. Please try again.';
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  // Implement todo update functionality with API call
  const handleUpdateTodo = async (id: string, todoData: UpdateTodoInput) => {
    try {
      setError(null); // Clear previous errors
      const updatedTodo = await todoService.update(id, todoData);
      setTodos(prev => prev.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      console.error('Error updating todo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo. Please try again.';
      setError(errorMessage);
    }
  };

  // Implement todo deletion functionality with API call and confirmation
  const handleDeleteTodo = async (id: string) => {
    setIsDeleting(id);
    try {
      setError(null); // Clear previous errors
      await todoService.delete(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo. Please try again.';
      setError(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  // Implement toggle completion functionality with API call and optimistic updates
  const handleToggleTodo = async (id: string) => {
    setIsToggling(id);

    // Optimistically update the UI
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));

    try {
      setError(null); // Clear previous errors
      const updatedTodo = await todoService.toggleCompletion(id);
      // Update with the server response to ensure consistency
      setTodos(prev => prev.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      // Rollback the optimistic update if the API call fails
      setTodos(prev => prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));

      console.error('Error toggling todo completion:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo status. Please try again.';
      setError(errorMessage);
    } finally {
      setIsToggling(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading..." centered />
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

  // Calculate statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Todo Dashboard</h1>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user.name || user.email}</span>
            <LogoutButton variant="secondary" size="sm" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            <span className="font-medium">Error: </span>{error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-400 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-800 truncate">Total Todos</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-blue-900">{totalTodos}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-400 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-green-800 truncate">Completed</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-green-900">{completedTodos}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-400 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-yellow-800 truncate">Pending</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-yellow-900">{pendingTodos}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Todo Creation Form */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold text-gray-800">Add New Todo</h2>
          </div>
          <TodoForm
            onSubmit={handleCreateTodo}
            isSubmitting={isCreating}
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[120px]"
            >
              <option value="all">All Todos</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as 'newest' | 'oldest' | 'a-z' | 'z-a')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[120px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="a-z">A to Z</option>
              <option value="z-a">Z to A</option>
            </select>
          </div>
        </div>

        {/* Todo List */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Todos ({filteredTodos.length})
              {filter !== 'all' && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({filter === 'active' ? 'active' : 'completed'})
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <LoadingSpinner size="md" text="Loading todos..." centered />
            </div>
          ) : filteredTodos.length === 0 ? (
            <EmptyState
              title={
                filter === 'all'
                  ? 'No todos yet'
                  : filter === 'active'
                    ? 'No active todos'
                    : 'No completed todos'
              }
              subtitle={
                filter === 'all'
                  ? 'Get started by creating your first todo.'
                  : filter === 'active'
                    ? 'All caught up! Great job!'
                    : 'No completed todos yet. Mark some todos as complete!'
              }
              action={
                filter === 'all' && (
                  <button
                    onClick={() => {
                    const element = document.querySelector('input[type="text"]');
                    if (element instanceof HTMLElement) {
                      element.focus();
                    }
                  }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-h-[44px] min-w-[44px]"
                  >
                    Add Todo
                  </button>
                )
              }
            />
          ) : (
            <div>
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={(updatedData) => handleUpdateTodo(todo.id, updatedData)}
                  onDelete={handleDeleteTodo}
                  onToggleComplete={handleToggleTodo}
                  isDeleting={isDeleting}
                  isToggling={isToggling}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;