import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

if (!process.env.MONGODB_URI) {
  throw new Error('Vui lòng định nghĩa MONGODB_URI trong file .env');
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToMongoDB = async (): Promise<mongoose.Connection | null> => {
  if (cached.conn) {
    console.log('Sử dụng kết nối MongoDB đã cache');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Đã tạo kết nối MongoDB mới');
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('Lỗi kết nối MongoDB:', error);
  }
  return cached.conn ? cached.conn : null; // Ensure a return statement at the end
};

// Xử lý đóng kết nối khi ứng dụng tắt
process.on('SIGINT', async () => {
  if (cached.conn) {
    await mongoose.disconnect();
    console.log('Đã đóng kết nối MongoDB');
    process.exit(0);
  }
}); 