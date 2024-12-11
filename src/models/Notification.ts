import mongoose, { Schema } from 'mongoose';

export interface INotification {
  _id?: string;
  userId: Schema.Types.ObjectId;
  title: string;
  content: string;
  type: 'post' | 'comment' | 'system';
  relatedId?: string; // ID của bài đăng hoặc comment liên quan
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['post', 'comment', 'system'],
    required: true 
  },
  relatedId: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema); 