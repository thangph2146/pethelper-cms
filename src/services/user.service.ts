import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface UpdateUserData {
  name?: string;
  image?: string;
  phone?: string;
  address?: string;
}

export const UserService = {
  async updateProfile(data: UpdateUserData) {
    const response = await axiosInstance.patch('/users/profile', data);
    return response.data;
  },

  async getSavedPosts() {
    const response = await axiosInstance.get('/users/saved-posts');
    return response.data;
  },

  async savePost(postId: string) {
    const response = await axiosInstance.post(`/users/saved-posts/${postId}`);
    return response.data;
  },

  async unsavePost(postId: string) {
    const response = await axiosInstance.delete(`/users/saved-posts/${postId}`);
    return response.data;
  },

  async getUserComments() {
    const response = await axiosInstance.get('/users/comments');
    return response.data;
  }
}; 