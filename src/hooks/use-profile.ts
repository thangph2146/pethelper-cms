import { useState, useEffect } from 'react';
import { ProfileService } from '@/services/profile.service';

interface Profile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await ProfileService.getProfile();
      setProfile(data);
      setError(null);
    } catch (error: any) {
      setError(error.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      setLoading(true);
      const updatedProfile = await ProfileService.updateProfile(profileData);
      setProfile(updatedProfile);
      setError(null);
      return updatedProfile;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      await ProfileService.changePassword({
        currentPassword,
        newPassword
      });
      setError(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    changePassword
  };
} 