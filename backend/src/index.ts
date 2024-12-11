import dotenv from 'dotenv';
dotenv.config();

import app from './server';
import mongoose from 'mongoose';
import config from './config';
import logger from './utils/logger';

const MAX_RETRIES = 0;
const RETRY_INTERVAL = 5000; // 5 seconds

const connectDB = async (retryCount = 0) => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });
    logger.info('Đã kết nối với MongoDB thành công');
  } catch (error: any) {
    logger.error(`Lỗi kết nối MongoDB (lần thử ${retryCount + 1}/${MAX_RETRIES}): ${error.message}`);
    
    if (error.name === 'MongooseServerSelectionError') {
      logger.error('Không thể kết nối tới MongoDB Atlas cluster. Vui lòng kiểm tra:');
      logger.error('1. IP của bạn đã được whitelist trong MongoDB Atlas');
      logger.error('2. Chuỗi kết nối MongoDB URI có chính xác');
      logger.error('3. Tài khoản MongoDB Atlas có quyền truy cập');
    }

    if (retryCount < MAX_RETRIES) {
      logger.info(`Đang thử kết nối lại sau ${RETRY_INTERVAL/1000} giây...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      return connectDB(retryCount + 1);
    }

    logger.error(`Đã thử kết nối ${MAX_RETRIES} lần không thành công. Thoát ứng dụng.`);
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

// Cập nhật error handlers cho mongoose
mongoose.connection.on('error', err => {
  logger.error('Lỗi kết nối MongoDB:', err);
  // Thử kết nối lại nếu mất kết nối
  setTimeout(() => {
    logger.info('Đang thử kết nối lại với MongoDB...');
    connectDB();
  }, RETRY_INTERVAL);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mất kết nối MongoDB - Đang thử kết nối lại...');
  setTimeout(() => {
    connectDB();
  }, RETRY_INTERVAL);
});

mongoose.connection.on('connected', () => {
  logger.info('Đã kết nối lại thành công với MongoDB');
});

startServer(); 