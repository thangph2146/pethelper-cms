'use client';

export function useRememberLogin() {
  const saveLoginInfo = (email: string) => {
    try {
      localStorage.setItem('savedEmail', email);
    } catch (error) {
      console.error('Lỗi khi lưu thông tin đăng nhập:', error);
    }
  };

  const getSavedEmail = (): string => {
    try {
      return localStorage.getItem('savedEmail') || '';
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đăng nhập:', error);
      return '';
    }
  };

  const clearLoginInfo = () => {
    try {
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('rememberMe');
    } catch (error) {
      console.error('Lỗi khi xóa thông tin đăng nhập:', error);
    }
  };

  return {
    saveLoginInfo,
    getSavedEmail,
    clearLoginInfo
  };
} 