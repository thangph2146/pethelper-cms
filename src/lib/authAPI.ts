import axiosInstance from '@/utils/axiosInstance';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
export interface RegisterResponse {
  success: boolean;
  message: string;
}

interface VerifyResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
  }
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
  },

  verifyToken: async (): Promise<VerifyResponse> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const { data } = await axiosInstance.get<VerifyResponse>('/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return data;
  }
};