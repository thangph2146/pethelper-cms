import mongoose, { Document, Schema, Types } from 'mongoose';
import type { IUser } from './User';
import type { IPost } from './Post';

export interface IComment extends Document {
  content: string;
  author: Types.ObjectId | IUser;
  post: Types.ObjectId | IPost;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentPopulated extends Omit<IComment, 'author'> {
  author: IUser;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo index để tìm kiếm nhanh hơn
CommentSchema.index({ post: 1, createdAt: -1 });

export const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema); 