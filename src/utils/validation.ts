import { ValidationError } from '@/types/error';

export const validateRegisterData = {
  name: (name: string) => {
    if (!name) {
      throw new ValidationError('Họ tên là bắt buộc', 400, 'name');
    }
    if (name.length < 2) {
      throw new ValidationError('Họ tên phải có ít nhất 2 ký tự', 400, 'name');
    }
  },

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
    console.log('password', password);

    if (!password) {
      throw new ValidationError('Mật khẩu là bắt buộc', 400, 'password');
    }
    if (password.length < 6) {
      throw new ValidationError('Mật khẩu phải có ít nhất 6 ký tự', 400, 'password');
    }
    // Thêm các quy tắc khác nếu cần
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    // if (!passwordRegex.test(password)) {
    //   throw new ValidationError(
    //     'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
    //     400,
    //     'password'
    //   );
    // }
  },

  phone: (phone: string) => {
    if (!phone) return; // Phone là optional
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      throw new ValidationError('Số điện thoại không hợp lệ', 400, 'phone');
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
