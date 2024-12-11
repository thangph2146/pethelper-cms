import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimal extends Document {
  name: string;
  type: string; // chó/mèo/khác
  age?: number;
  description: string;
  location: string;
  status: string; // cần cứu trợ/đã được cứu/đang điều trị
  images: string[];
  contact: {
    phone: string;
    email?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AnimalSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  age: { type: Number },
  description: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true },
  images: [{ type: String }],
  contact: {
    phone: { type: String, required: true },
    email: { type: String }
  }
}, {
  timestamps: true
});

export default mongoose.model<IAnimal>('Animal', AnimalSchema); 