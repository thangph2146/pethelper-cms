import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/animal-rescue';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối với MongoDB');
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error);
    throw error;
  }
}

export default connectDB; 