import mongoose, { Document, Types } from 'mongoose';

export interface IComment extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true
});

// Đảm bảo virtuals được bao gồm khi chuyển đổi sang JSON
commentSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema); 