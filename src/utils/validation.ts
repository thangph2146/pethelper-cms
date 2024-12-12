export class ValidationError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateRegisterData = {
  password: (password: string) => {
    const MIN_LENGTH = 6;
    if (password.length < MIN_LENGTH) {
      throw new ValidationError(`Mật khẩu phải có ít nhất ${MIN_LENGTH} ký tự`);
    }
  },

  name: (name: string) => {
    if (name.length < 2) {
      throw new ValidationError('Tên phải có ít nhất 2 ký tự');
    }
  },

  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Email không hợp lệ');
    }
  },

  phone: (phone?: string) => {
    if (!phone) return;
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      throw new ValidationError('Số điện thoại không hợp lệ');
    }
  }
}; 
