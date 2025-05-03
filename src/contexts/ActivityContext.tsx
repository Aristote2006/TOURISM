import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAllActivities,
  getActivityById as getActivity,
  createActivity,
  updateActivity as updateActivityService,
  deleteActivity as deleteActivityService,
  toggleFeatured as toggleFeaturedService
} from '@/services/activityService';

// Import the Activity type from the service
import { Activity } from '@/services/activityService';

interface ActivityContextType {
  activities: Activity[];
  loading: boolean;
  addActivity: (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => Promise<Activity | null>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<Activity | null>;
  deleteActivity: (id: string) => Promise<boolean>;
  getActivityById: (id: string) => Promise<Activity | null>;
  toggleFeatured: (id: string) => Promise<Activity | null>;
}

const ActivityContext = createContext<ActivityContextType>({
  activities: [],
  loading: true,
  addActivity: async () => null,
  updateActivity: async () => null,
  deleteActivity: async () => false,
  getActivityById: async () => null,
  toggleFeatured: async () => null,
});

export const useActivities = () => useContext(ActivityContext);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Load activities from MongoDB
  useEffect(() => {
    async function loadActivities() {
      try {
        console.log('Loading activities...');
        setLoading(true);
        const data = await getAllActivities();
        console.log('Activities loaded:', data);
        setActivities(data);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  // Add a new activity
  const addActivity = async (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const newActivity = await createActivity(activity);

      if (newActivity) {
        setActivities(prev => [...prev, newActivity]);
        return newActivity;
      }

      return null;
    } catch (error) {
      console.error('Error adding activity:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing activity
  const updateActivity = async (id: string, updatedFields: Partial<Activity>) => {
    try {
      setLoading(true);
      const updatedActivity = await updateActivityService(id, updatedFields);

      if (updatedActivity) {
        setActivities(prev =>
          prev.map(activity =>
            activity.id === id ? updatedActivity : activity
          )
        );
        return updatedActivity;
      }

      return null;
    } catch (error) {
      console.error('Error updating activity:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an activity
  const deleteActivity = async (id: string) => {
    try {
      console.log('ActivityContext: Attempting to delete activity with ID:', id);
      setLoading(true);
      const success = await deleteActivityService(id);

      console.log('ActivityContext: Delete activity result:', success);

      if (success) {
        console.log('ActivityContext: Removing activity from state');
        setActivities(prev => {
          const newActivities = prev.filter(activity => activity.id !== id);
          console.log('ActivityContext: Activities before:', prev.length, 'after:', newActivities.length);
          return newActivities;
        });
      } else {
        console.error('ActivityContext: Failed to delete activity:', id);
      }

      return success;
    } catch (error) {
      console.error('ActivityContext: Error deleting activity:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get activity by ID
  const getActivityById = async (id: string) => {
    try {
      // First check if it's in the local state
      const localActivity = activities.find(activity => activity.id === id);
      if (localActivity) return localActivity;

      // If not, fetch from MongoDB
      return await getActivity(id);
    } catch (error) {
      console.error('Error getting activity by ID:', error);
      return null;
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string) => {
    try {
      setLoading(true);
      const updatedActivity = await toggleFeaturedService(id);

      if (updatedActivity) {
        setActivities(prev =>
          prev.map(activity =>
            activity.id === id ? updatedActivity : activity
          )
        );
        return updatedActivity;
      }

      return null;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        loading,
        addActivity,
        updateActivity,
        deleteActivity,
        getActivityById,
        toggleFeatured,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
