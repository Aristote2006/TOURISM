import { useState, useEffect } from 'react';
import { loginUser, verifyToken, updateUserActivity } from '@/services/authService';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
          // Token is valid, set user
          setUser({
            id: decoded.id,
            email: decoded.email,
            first_name: decoded.first_name || '',
            last_name: decoded.last_name || '',
            role: decoded.role,
            avatar_url: decoded.avatar_url
          });
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await loginUser(email, password);

      if (result.success && result.token && result.user) {
        // Save token to localStorage
        localStorage.setItem('auth_token', result.token);

        // Set user
        setUser({
          id: result.user.id,
          email: result.user.email,
          first_name: result.user.first_name,
          last_name: result.user.last_name,
          role: result.user.role,
          avatar_url: result.user.avatar_url
        });

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Remove token from localStorage
      localStorage.removeItem('auth_token');

      // Clear user state
      setUser(null);

      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, error };
    }
  };

  // Update last activity timestamp
  const updateActivity = async () => {
    if (!user) return;

    try {
      await updateUserActivity(user.id);
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    updateActivity
  };
}
