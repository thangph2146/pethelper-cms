import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Định nghĩa interface cho User document
interface IUser extends Document {
  name: string;
  image: string; 
  email: string;
  password: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  lastActive: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Thêm middleware để hash password trước khi lưu
userSchema.pre('save', async function(next) {
  const user = this as unknown as IUser;
  
  // Chỉ hash password nếu nó được thay đổi
  if (!user.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Thêm phương thức so sánh password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Thêm các indexes
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });

export const User = mongoose.models.User as mongoose.Model<IUser> || 
                   mongoose.model<IUser>('User', userSchema);

// Export interface để sử dụng ở nơi khác
export type { IUser }; 