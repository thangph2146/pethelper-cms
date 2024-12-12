import { connectToMongoDB } from '@/lib/mongodb';
import { User } from '@/backend/models/User';
import { hash } from 'bcryptjs';
import type { RegisterData, CreateUserResponse } from '@/types/auth';
import type { UserStatus, UserRole } from '@/types/user';
import { validateRegisterData, ValidationError } from '@/utils/validation';

export class UserServiceError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
    this.name = 'UserServiceError';
  }
}

export const UserService = {
  async createUser(data: RegisterData): Promise<CreateUserResponse> {
    try {
      await connectToMongoDB();

      // Validate dữ liệu bắt buộc
      if (!data.email || !data.password || !data.name) {
        throw new UserServiceError('Vui lòng điền đầy đủ thông tin');
      }

      // Validate các trường
      validateRegisterData.name(data.name);
      validateRegisterData.email(data.email);
      validateRegisterData.password(data.password);
      if (data.phone) {
        validateRegisterData.phone(data.phone); // Chỉ validate phone khi có giá trị
      }

      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new UserServiceError('Email đã được sử dụng');
      }

      // Hash password
      const hashedPassword = await hash(data.password, 12);

      // Tạo user mới
      const user = await User.create({
        ...data,
        password: hashedPassword,
        status: 'active' as UserStatus,
        role: 'user' as UserRole
      });

      // Không trả về password trong response
      const userObject = user.toObject();
      // delete userObject.password;

      return userObject as CreateUserResponse;
    } catch (error) {
      if (error instanceof UserServiceError || error instanceof ValidationError) {
        throw error;
      }
      console.error('Create user error:', error);
      throw new UserServiceError('Có lỗi xảy ra khi tạo tài khoản', 500);
    }
  }
} 
