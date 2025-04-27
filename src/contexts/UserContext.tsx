import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, updateUserProfile } from '@/services/authService';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
}

interface UserContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
}

const UserContext = createContext<UserContextType>({
  userProfile: null,
  loading: true,
  updateProfile: async () => {},
  uploadAvatar: async () => null
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        // Check for stored avatar in localStorage
        const storedAvatar = localStorage.getItem('userAvatar');

        // Get user profile from MongoDB
        const profile = await getUserProfile(user.id);

        if (profile) {
          setUserProfile({
            id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            phone: profile.phone,
            // Use localStorage avatar if available, otherwise use the one from the database
            avatar_url: storedAvatar || profile.avatar_url
          });
        } else {
          // Fallback to basic user info
          setUserProfile({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: null,
            avatar_url: storedAvatar || null
          });
        }
      } catch (error) {
        console.error('Error in profile management:', error);
        // Fallback to basic user info
        const storedAvatar = localStorage.getItem('userAvatar');
        setUserProfile({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: null,
          avatar_url: storedAvatar || null
        });
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !userProfile) return;

    try {
      setLoading(true);

      // If avatar_url is being updated and it's a base64 string, store it in localStorage
      if (data.avatar_url && data.avatar_url.startsWith('data:image')) {
        localStorage.setItem('userAvatar', data.avatar_url);
      }

      // Update the profile in MongoDB
      const success = await updateUserProfile(user.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        // Only store the URL in MongoDB, not the base64 data
        avatar_url: data.avatar_url?.startsWith('data:image') ? 'profile-image-uploaded' : data.avatar_url,
      });

      if (!success) throw new Error('Failed to update profile');

      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...data } : null);

    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      setLoading(true);

      // Convert file to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
          if (!event.target?.result) {
            reject(new Error("Failed to read file"));
            return;
          }

          const base64String = event.target.result as string;

          try {
            // Store in localStorage
            localStorage.setItem('userAvatar', base64String);

            // Update the profile
            await updateProfile({ avatar_url: base64String });

            resolve(base64String);
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, loading, updateProfile, uploadAvatar }}>
      {children}
    </UserContext.Provider>
  );
};
