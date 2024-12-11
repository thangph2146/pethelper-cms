import dotenv from 'dotenv';
dotenv.config();

import app from './server';
import mongoose from 'mongoose';
import config from './config';
import logger from './utils/logger';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });
    logger.info('Đã kết nối với MongoDB');
  } catch (error: any) {
    logger.error(`Lỗi kết nối MongoDB: ${error.message}`);
    if (error.name === 'MongooseServerSelectionError') {
      logger.error('Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you\'re trying to access the database from an IP that isn\'t whitelisted. Make sure your current IP address is on your Atlas cluster\'s IP whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/');
    }
    process.exit(1);
  }
};

const findAvailablePort = async (startPort: number): Promise<number> => {
  const net = require('net');
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Port đang được sử dụng, thử port tiếp theo
        findAvailablePort(startPort + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });

    server.listen(startPort, () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
  });
};

const startServer = async () => {
  try {
    // Kết nối MongoDB với retry
    await connectDB();

    // Tìm port khả dụng
    const port = await findAvailablePort(Number(config.port));
    if (port !== Number(config.port)) {
      logger.warn(`Port ${config.port} đang được sử dụng, chuyển sang port ${port}`);
    }

    // Khởi động server
    app.listen(port, () => {
      logger.info(`Server đang chạy tại http://localhost:${port}`);
    });

    // Xử lý graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('Đã đóng kết nối MongoDB');
        process.exit(0);
      } catch (err) {
        logger.error('Lỗi khi đóng kết nối:', err);
        process.exit(1);
      }
    });

    // Xử lý unhandled rejections
    process.on('unhandledRejection', (err: Error) => {
      logger.error('Unhandled Rejection:', err);
    });

    // Xử lý uncaught exceptions
    process.on('uncaughtException', (err: Error) => {
      logger.error('Uncaught Exception:', err);
      if (err.message.includes('EADDRINUSE')) {
        logger.warn('Port đang được sử dụng, thử port khác...');
      } else {
        process.exit(1);
      }
    });

  } catch (error) {
    logger.error('Lỗi khởi động server:', error);
    process.exit(1);
  }
};

// Error handlers cho mongoose
mongoose.connection.on('error', err => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected');
});

startServer(); 