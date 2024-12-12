import { useState } from 'react';
import { ProfileService } from '@/services/profile.service';
import { toast } from 'react-hot-toast';
import type { ApiError } from '@/types/api';
import type { SafeUser } from '@/types/user';

interface ProfileData {
  name?: string;
  email?: string;
  avatar?: File;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<SafeUser | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const updateProfile = async (data: ProfileData) => {
    try {
      setLoading(true);
      await ProfileService.updateProfile(data);
      toast.success('Cập nhật thông tin thành công');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async ({ currentPassword, newPassword }: PasswordData) => {
    try {
      setLoading(true);
      await ProfileService.changePassword({ currentPassword, newPassword });
      toast.success('Đổi mật khẩu thành công');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      await ProfileService.deleteAccount();
      toast.success('Xóa tài khoản thành công');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Có lỗi xảy ra khi xóa tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    profile,
    error,
    updateProfile,
    changePassword,
    deleteAccount
  };
} 