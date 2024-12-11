import mongoose, { Schema } from 'mongoose';

export interface IReport {
  _id?: string;
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'resolved', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema); 