'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../lib/auth/useAuth';
import TodoForm from '../../components/todos/TodoForm';
import TodoList from '../../components/todos/TodoList';

export default function DashboardPage() {
  const { authState, logout } = useAuth();
  const router = useRouter();

  console.log('[Dashboard] Received auth state:', {
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    token: !!authState.token,
    error: authState.error
  });

  // Redirect to login if not authenticated, but only after auth state is hydrated
  useEffect(() => {
    console.log('[Dashboard] Effect running with auth state:', {
      isLoading: authState.isLoading,
      isAuthenticated: authState.isAuthenticated
    });

    if (!authState.isLoading && !authState.isAuthenticated) {
      console.log('[Dashboard] Redirecting to login');
      router.push('/login');
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  // Show loading state while auth state is initializing
  if (authState.isLoading) {
    console.log('[Dashboard] Rendering loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect will happen via useEffect)
  if (!authState.isAuthenticated) {
    console.log('[Dashboard] Not authenticated, returning null');
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Todo Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {authState.userProfile?.username
                  ? `Welcome, ${authState.userProfile.username}`
                  : authState.isLoading
                  ? 'Welcome, Loading...'
                  : 'Welcome'}
              </span>
              <button
                onClick={() => router.push('/profile')}
                className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between mb-6">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                My Tasks
              </h2>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <TodoForm />
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Your Tasks</h3>
                <TodoList />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}