import { User } from '@/backend/models/User';

export const userService = {
  findById: (id: string) => User.findById(id),
  // ... các phương thức khác
}; 