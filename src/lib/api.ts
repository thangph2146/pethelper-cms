import axiosInstance, { LoginResponse } from './axios';
import bcrypt from 'bcryptjs';

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await axiosInstance.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    console.log('data', data);
    return data;
  },

  register: async (name: string, email: string, password: string, phone: string) => {
    const { data } = await axiosInstance.post<RegisterResponse>('/auth/register', {
      name,
      email,
      password,
      phone
    });
    console.log('data', data);
    return data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};