import mongoose, { Document, Types } from 'mongoose';

export interface INotification extends Document {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: 'comment' | 'reply' | 'like' | 'status_update';
  post: Types.ObjectId;
  comment?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['comment', 'reply', 'like', 'status_update'],
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema); 