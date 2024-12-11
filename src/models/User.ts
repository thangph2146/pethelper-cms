import mongoose, { Document, Schema, Types } from 'mongoose';
import type { IPost } from './Post';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: 'user' | 'admin';
  savedPosts?: Types.ObjectId[] | IPost[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false, // Không trả về password khi query
    },
    image: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    savedPosts: [{
      type: Schema.Types.ObjectId,
      ref: 'Post',
    }],
  },
  {
    timestamps: true,
  }
);

// Thêm phương thức comparePassword
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  const user = await User.findById(this._id).select('+password');
  if (!user?.password) return false;
  return bcrypt.compare(candidatePassword, user.password);
};

// Tạo index để tìm kiếm nhanh hơn
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 