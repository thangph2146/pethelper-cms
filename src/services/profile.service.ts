interface ProfileData {
  name?: string;
  phone?: string;
  address?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export class ProfileService {
  static async getProfile() {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.error || 'Đã có lỗi xảy ra khi lấy thông tin profile'
        };
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  static async updateProfile(profileData: ProfileData) {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.error || 'Đã có lỗi xảy ra khi cập nhật profile'
        };
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  static async changePassword(data: ChangePasswordData) {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          message: responseData.error || 'Đã có lỗi xảy ra khi đổi mật khẩu'
        };
      }

      return responseData;
    } catch (error: any) {
      throw error;
    }
  }
} 