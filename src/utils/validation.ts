import { ValidationError } from '@/types/error';

export const validateRegisterData = {
  name: (name: string) => {
    if (!name || name.trim().length < 2) {
      throw new ValidationError('Tên phải có ít nhất 2 ký tự', 'name');
    }
  },

  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new ValidationError('Email không hợp lệ', 'email');
    }
  },

  password: (password: string) => {
    if (!password || password.length < 6) {
      throw new ValidationError('Mật khẩu phải có ít nhất 6 ký tự', 'password');
    }
  },

  phone: (phone: string) => {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
      throw new ValidationError('Số điện thoại không hợp lệ', 'phone');
    }
  }
};

export const validateLoginData = {
  email: (email: string) => {
    if (!email) {
      throw new ValidationError('Email là bắt buộc', 400, 'email');
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Email không hợp lệ', 400, 'email');
    }
  },

  password: (password: string) => {
    if (!password) {
      throw new ValidationError('Mật khẩu là bắt buộc', 400, 'password');
    }
    if (password.length < 6) {
      throw new ValidationError('Mật khẩu phải có ít nhất 6 ký tự', 400, 'password');
    }
  },

  form: (data: {email: string; password: string}) => {
    try {
      validateLoginData.email(data.email);
      validateLoginData.password(data.password);
      return true;
    } catch (error) {
      return false;
    }
  }
};
