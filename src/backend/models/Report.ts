import mongoose, { Document, Types } from 'mongoose';

export interface IReport extends Document {
  reporter: Types.ObjectId;
  post: Types.ObjectId;
  reason: 'spam' | 'inappropriate' | 'violence' | 'other';
  description: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  reason: {
    type: String,
    enum: ['spam', 'inappropriate', 'violence', 'other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'rejected'],
    default: 'pending',
  }
}, {
  timestamps: true
});

export const Report = mongoose.models.Report || mongoose.model<IReport>('Report', reportSchema); 