
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const { toast } = useToast();

  // Function to log out the user
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear any session data from localStorage
      localStorage.removeItem('lastActivity');
      // Redirect will happen via the ProtectedRoute component
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      // Force a page reload to ensure all state is cleared
      window.location.href = '/auth';
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "There was a problem logging out.",
        variant: "destructive"
      });
    }
  };

  // Update last activity timestamp
  const updateActivity = () => {
    const now = Date.now();
    setLastActivity(now);
    localStorage.setItem('lastActivity', now.toString());
  };

  // Check for session timeout
  useEffect(() => {
    const checkSessionTimeout = () => {
      const storedLastActivity = localStorage.getItem('lastActivity');
      if (storedLastActivity) {
        const lastActivityTime = parseInt(storedLastActivity);
        const now = Date.now();

        // If the session has timed out, log the user out
        if (now - lastActivityTime > SESSION_TIMEOUT) {
          // Clear session data
          localStorage.removeItem('lastActivity');

          // Show toast and redirect
          toast({
            title: "Session expired",
            description: "Your session has expired. Please log in again.",
          });

          // Force redirect to auth page
          window.location.href = '/auth';
        }
      }
    };

    // Set up activity listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => updateActivity();

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Check for timeout when component mounts
    checkSessionTimeout();

    // Set up interval to check for timeout
    const interval = setInterval(checkSessionTimeout, 60000); // Check every minute

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [toast]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // If user just logged in, update activity timestamp
        if (session?.user) {
          updateActivity();
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // If user is logged in, update activity timestamp
      if (session?.user) {
        updateActivity();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    logout,
    updateActivity,
  };
}
