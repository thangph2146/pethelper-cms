import mongoose, { Document, Schema, Types } from 'mongoose';
import type { IUser } from './User';
import type { IComment } from './Comment';

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId | IUser;
  status: 'need_help' | 'helping' | 'helped';
  animalType: 'dog' | 'cat' | 'other';
  location: string;
  images?: string[];
  likes?: Types.ObjectId[];
  comments?: Types.ObjectId[] | IComment[];
  currentUserId?: string; // Để kiểm tra user hiện tại đã like bài viết chưa
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthor extends IUser {
  name: string;
  email: string;
  image?: string;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['need_help', 'helping', 'helped'],
      default: 'need_help',
    },
    animalType: {
      type: String,
      enum: ['dog', 'cat', 'other'],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: [String],
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }],
  },
  {
    timestamps: true,
  }
);

// Tạo index để tìm kiếm nhanh hơn
PostSchema.index({ status: 1, createdAt: -1 });
PostSchema.index({ animalType: 1 });
PostSchema.index({ author: 1 });

export const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema); 