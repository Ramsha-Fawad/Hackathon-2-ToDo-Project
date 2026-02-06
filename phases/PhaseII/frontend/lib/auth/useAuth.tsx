/**
 * Authentication hook for the frontend application
 * JWT-based (FastAPI compatible)
 */

"use client";

import { useState, useEffect, createContext, useContext } from "react";
import TokenManager from "./token-manager";
import { AuthState, UserProfile } from "../types/auth";
import { AppConfig } from "../config";

/* -------------------- Types -------------------- */

interface AuthContextType {
  authState: AuthState & { userProfile: UserProfile | null };
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<UserProfile | null>;
}

/* -------------------- Context -------------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* -------------------- Provider -------------------- */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState & { userProfile: UserProfile | null }>({
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    userProfile: null,
  });

  /* ----------- Initial auth check ----------- */
  useEffect(() => {
    console.log("[useAuth] Initializing auth state");

    try {
      const storedToken = TokenManager.getToken();
      const isValid = storedToken ? TokenManager.isValid() : false;

      if (storedToken && isValid) {
        console.log("[useAuth] Valid token found");

        // Set initial auth state with token but keep loading true until profile is fetched
        setAuthState(prev => ({
          ...prev,
          token: storedToken,
          isAuthenticated: true,
          isLoading: true, // Keep loading until profile is fetched
          error: null,
          userProfile: null,
        }));

        // Fetch user profile and update state when complete
        fetchUserProfile().then(() => {
          setAuthState(prev => ({
            ...prev,
            isLoading: false, // Now we can set loading to false
          }));
        }).catch(() => {
          setAuthState(prev => ({
            ...prev,
            isLoading: false, // Even if profile fetch fails, stop loading
          }));
        });
      } else {
        console.log("[useAuth] No valid token");

        TokenManager.clearToken();
        setAuthState({
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          userProfile: null,
        });
      }
    } catch (error) {
      console.error("[useAuth] Init error:", error);

      TokenManager.clearToken();
      setAuthState({
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Authentication initialization failed",
        userProfile: null,
      });
    }
  }, []);

  /* -------------------- Login -------------------- */

  const login = async (email: string, password: string) => {
    console.log("[useAuth] Login started");

    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Direct API call to our backend instead of using Better Auth client
      const response = await fetch(`${AppConfig.BACKEND_API_BASE_URL}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Login failed with status ${response.status}`);
      }

      const data = await response.json();

      /**
       * EXPECTED BACKEND RESPONSE:
       * {
       *   access_token: string,
       *   token_type: "bearer"
       * }
       */

      const accessToken = data?.access_token;

      if (!accessToken) {
        throw new Error("No access token returned from server");
      }

      const expiresInMs = 30 * 60 * 1000; // 30 minutes (matches backend)
      const expiresAt = Date.now() + expiresInMs;

      // Extract the actual user ID from the JWT token instead of using email
      const actualUserId = TokenManager.extractUserIdFromJWT(accessToken);
      if (!actualUserId) {
        throw new Error("Invalid token: no user ID found in JWT");
      }

      TokenManager.storeToken(accessToken, actualUserId, expiresInMs);

      // Update auth state but keep loading true until profile is loaded
      setAuthState(prev => ({
        ...prev,
        token: {
          token: accessToken,
          userId: actualUserId,
          expiresAt,
        },
        isAuthenticated: true,
        isLoading: true, // Keep loading until profile is fetched
        error: null,
      }));

      console.log("[useAuth] Login successful");

      // Fetch user profile and update state when complete
      fetchUserProfile().then(() => {
        setAuthState(prev => ({
          ...prev,
          isLoading: false, // Now we can set loading to false
        }));
      }).catch(() => {
        setAuthState(prev => ({
          ...prev,
          isLoading: false, // Even if profile fetch fails, stop loading
        }));
      });
    } catch (error) {
      console.error("[useAuth] Login failed:", error);

      TokenManager.clearToken();
      setAuthState({
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Login failed",
        userProfile: null,
      });

      throw error;
    }
  };

  /* -------------------- Signup -------------------- */

  const signup = async (email: string, password: string, name: string) => {
    console.log("[useAuth] Signup started");

    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Direct API call to our backend instead of using Better Auth client
      const response = await fetch(`${AppConfig.BACKEND_API_BASE_URL}/api/auth/sign-up/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username: name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Signup failed with status ${response.status}`);
      }

      // Auto-login after signup (login will fetch the profile)
      await login(email, password);
    } catch (error) {
      console.error("[useAuth] Signup failed:", error);

      setAuthState({
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Signup failed",
        userProfile: null,
      });

      throw error;
    }
  };

  /* -------------------- Logout -------------------- */

  const logout = async () => {
    console.log("[useAuth] Logout");

    TokenManager.clearToken();

    setAuthState({
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      userProfile: null,
    });
  };

  /* -------------------- Profile Management -------------------- */

  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    if (!authState.token) {
      console.warn("No token available to fetch user profile");
      return null;
    }

    try {
      // Direct API call to our backend
      const response = await fetch(`${AppConfig.BACKEND_API_BASE_URL}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authState.token.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch user profile:", errorData);
        return null;
      }

      const profileData = await response.json();

      // Update the auth state with the profile
      setAuthState(prev => ({
        ...prev,
        userProfile: profileData,
      }));

      return profileData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  /* -------------------- Provider value -------------------- */

  const value: AuthContextType = {
    authState,
    login,
    signup,
    logout,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* -------------------- Hook -------------------- */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
