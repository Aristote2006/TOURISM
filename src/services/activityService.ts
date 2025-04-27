// API service for activities
const API_URL = '/api';

export interface Activity {
  id: string;
  name: string;
  type: string;
  image: string;
  description: string;
  location: string;
  fullAddress?: string;
  latitude?: string;
  longitude?: string;
  contact?: string;
  phone?: string;
  featured: boolean;
  created_at: string;
  updated_at?: string;
}

export async function getAllActivities(): Promise<Activity[]> {
  try {
    const response = await fetch(`${API_URL}/activities`);

    if (!response.ok) {
      return [];
    }

    const activities = await response.json();
    return activities;
  } catch (error) {
    console.error('Get all activities error:', error);
    return [];
  }
}

export async function getActivityById(id: string): Promise<Activity | null> {
  try {
    const response = await fetch(`${API_URL}/activities/${id}`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Get activity by ID error:', error);
    return null;
  }
}

export async function createActivity(activityData: Partial<Activity>): Promise<Activity | null> {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Create activity error:', error);
    return null;
  }
}

export async function updateActivity(id: string, activityData: Partial<Activity>): Promise<Activity | null> {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/activities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Update activity error:', error);
    return null;
  }
}

export async function deleteActivity(id: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    const response = await fetch(`${API_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Delete activity error:', error);
    return false;
  }
}

export async function toggleFeatured(id: string): Promise<Activity | null> {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/activities/${id}/featured`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Toggle featured error:', error);
    return null;
  }
}

export async function getFeaturedActivities(): Promise<Activity[]> {
  try {
    const response = await fetch(`${API_URL}/activities/featured`);

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Get featured activities error:', error);
    return [];
  }
}
