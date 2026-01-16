'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createAuthClient } from 'better-auth/client';

// Initialize the auth client
const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  }
});

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const sessionData = await authClient.getSession();

      if (sessionData?.session) {
        setUser({
          id: sessionData.session.user.id,
          email: sessionData.session.user.email,
          name: sessionData.session.user.name || sessionData.session.user.email?.split('@')[0],
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signInUser = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result?.session) {
        setUser({
          id: result.session.userId,
          email: result.session.user.email,
          name: result.session.user.name || result.session.user.email?.split('@')[0],
        });
        return { success: true };
      } else {
        return { success: false, error: result?.error?.message || 'Sign in failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  };

  const signUpUser = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
      });

      if (result?.session) {
        setUser({
          id: result.session.userId,
          email: result.session.user.email,
          name: result.session.user.name || result.session.user.email?.split('@')[0],
        });
        return { success: true };
      } else {
        return { success: false, error: result?.error?.message || 'Sign up failed' };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  };

  const signOutUser = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    isLoading,
    signIn: signInUser,
    signUp: signUpUser,
    signOut: signOutUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}