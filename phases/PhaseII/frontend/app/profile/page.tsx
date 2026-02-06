'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../lib/auth/useAuth';

export default function ProfilePage() {
  const { authState, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated, but only after auth state is hydrated
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push('/login');
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  // Show loading state while auth state is initializing
  if (authState.isLoading) {
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
              <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Profile</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                  <dl className="mt-2 divide-y divide-gray-200">
                    <div className="py-3 flex justify-between text-sm">
                      <dt className="text-gray-500">Username</dt>
                      <dd className="text-gray-900">{authState.userProfile?.username || 'Loading...'}</dd>
                    </div>
                    <div className="py-3 flex justify-between text-sm">
                      <dt className="text-gray-500">Email</dt>
                      <dd className="text-gray-900">{authState.userProfile?.email || 'N/A'}</dd>
                    </div>
                    <div className="py-3 flex justify-between text-sm">
                      <dt className="text-gray-500">User ID</dt>
                      <dd className="text-gray-900">{authState.token?.userId}</dd>
                    </div>
                    <div className="py-3 flex justify-between text-sm">
                      <dt className="text-gray-500">Status</dt>
                      <dd className="text-gray-900">Authenticated</dd>
                    </div>
                    <div className="py-3 flex justify-between text-sm">
                      <dt className="text-gray-500">Token Expiry</dt>
                      <dd className="text-gray-900">
                        {new Date(authState.token?.expiresAt || 0).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Actions</h3>
                  <div className="mt-2 space-y-2">
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}