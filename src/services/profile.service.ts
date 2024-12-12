import { supabase } from '@/lib/supabase';
import type { PostgrestError, AuthError } from '@supabase/supabase-js';

interface Profile {
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

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

type ServiceError = PostgrestError | AuthError | Error;

export class ProfileService {
  static async getProfile(): Promise<Profile> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('Không tìm thấy người dùng');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Không tìm thấy profile');

      return data;
    } catch (error: unknown) {
      const serviceError = error as ServiceError;
      throw new Error(serviceError.message || 'Lấy thông tin profile thất bại');
    }
  }

  static async updateProfile(data: UpdateProfileData): Promise<Profile> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('Không tìm thấy người dùng');

      const { data: profile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (!profile) throw new Error('Cập nhật profile thất bại');

      return profile;
    } catch (error: unknown) {
      const serviceError = error as ServiceError;
      throw new Error(serviceError.message || 'Cập nhật profile thất bại');
    }
  }

  static async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) throw error;
    } catch (error: unknown) {
      const serviceError = error as ServiceError;
      throw new Error(serviceError.message || 'Đổi mật khẩu thất bại');
    }
  }

  static async deleteAccount(): Promise<void> {
    try {
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );

      if (error) throw error;
    } catch (error: unknown) {
      const serviceError = error as ServiceError;
      throw new Error(serviceError.message || 'Xóa tài khoản thất bại');
    }
  }
}
