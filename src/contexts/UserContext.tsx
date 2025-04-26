import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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

const defaultUserProfile: UserProfile = {
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  avatar_url: null
};

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
        // First check if profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Check for stored avatar in localStorage
        const storedAvatar = localStorage.getItem('userAvatar');

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        // If profile exists, use it
        if (profileData) {
          setUserProfile({
            id: profileData.id,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: user.email || '',
            phone: profileData.phone,
            // Use localStorage avatar if available, otherwise use the one from the database
            avatar_url: storedAvatar || profileData.avatar_url
          });
        } else {
          // If no profile, create one with user metadata
          const userData = user.user_metadata;

          const newProfile = {
            id: user.id,
            first_name: userData?.first_name || '',
            last_name: userData?.last_name || '',
            email: user.email || '',
            phone: userData?.phone || '',
            avatar_url: storedAvatar || null
          };

          // Insert the new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              first_name: newProfile.first_name,
              last_name: newProfile.last_name,
              phone: newProfile.phone,
              role: 'user'
            }]);

          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }

          setUserProfile(newProfile);
        }
      } catch (error) {
        console.error('Error in profile management:', error);
        // Fallback to basic user info
        const storedAvatar = localStorage.getItem('userAvatar');
        setUserProfile({
          id: user.id,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
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

      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          // Only store the URL in Supabase, not the base64 data
          avatar_url: data.avatar_url?.startsWith('data:image') ? 'profile-image-uploaded' : data.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

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
