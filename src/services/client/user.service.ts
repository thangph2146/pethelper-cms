import { supabase } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';
import type { IComment } from '@backend/models/Comment';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface UpdateProfileData {
  name?: string;
  avatar_url?: string;
}

export function useUserService() {
  const savePost = async (postId: string): Promise<void> => {
    const { data, error } = await supabase
      .from('saved_posts')
      .insert({ post_id: postId });
  }
  const unsavePost = async (postId: string): Promise<void> => {
    const { data, error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('post_id', postId);
  }
  const getUserComments = async (): Promise<IComment[]> => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) throw new Error('Không tìm thấy bình luận');

    return data;
  }


  const getCurrentUser = async (): Promise<User> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!user) throw new Error('Không tìm thấy người dùng');
      
      return user;
    } catch (error: unknown) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Lấy thông tin người dùng thất bại');
    }
  };

  const getProfile = async (userId: string): Promise<UserProfile> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Không tìm thấy profile');

      return data;
    } catch (error: unknown) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Lấy thông tin profile thất bại');
    }
  };

  const updateProfile = async (userId: string, data: UpdateProfileData): Promise<UserProfile> => {
    try {
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      if (!updatedProfile) throw new Error('Cập nhật profile thất bại');

      return updatedProfile;
    } catch (error: unknown) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Cập nhật profile thất bại');
    }
  };

  return {
    getCurrentUser,
    getUserComments,
    getProfile,
    updateProfile,
    savePost,
    unsavePost
  };
} 