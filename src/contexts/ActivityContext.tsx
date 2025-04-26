import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the Activity type
export interface Activity {
  id: string;
  name: string;
  type: string;
  image: string;
  description: string;
  location: string;
  fullAddress?: string;
  latitude?: string | null;
  longitude?: string | null;
  contact?: string;
  phone?: string;
  featured: boolean;
  createdAt: string;
}

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  getActivityById: (id: string) => Activity | undefined;
  toggleFeatured: (id: string) => void;
}

const ActivityContext = createContext<ActivityContextType>({
  activities: [],
  addActivity: () => {},
  updateActivity: () => {},
  deleteActivity: () => {},
  getActivityById: () => undefined,
  toggleFeatured: () => {},
});

export const useActivities = () => useContext(ActivityContext);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize activities from localStorage or empty array
  const [activities, setActivities] = useState<Activity[]>(() => {
    const savedActivities = localStorage.getItem('activities');
    return savedActivities ? JSON.parse(savedActivities) : [];
  });

  // Save activities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  // Add a new activity
  const addActivity = (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setActivities((prev) => [...prev, newActivity]);
  };

  // Update an existing activity
  const updateActivity = (id: string, updatedFields: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, ...updatedFields } : activity
      )
    );
  };

  // Delete an activity
  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
  };

  // Get activity by ID
  const getActivityById = (id: string) => {
    return activities.find((activity) => activity.id === id);
  };

  // Toggle featured status
  const toggleFeatured = (id: string) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, featured: !activity.featured } : activity
      )
    );
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
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
