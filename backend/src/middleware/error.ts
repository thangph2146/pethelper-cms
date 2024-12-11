import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

interface ValidationError {
  path: string;
  message: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // MongoDB Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err as any).reduce((acc: ValidationError[], val: any) => {
      if (val.properties) {
        acc.push({
          path: val.properties.path,
          message: val.properties.message
        });
      }
      return acc;
    }, []);

    return res.status(400).json({
      error: 'Dữ liệu không hợp lệ',
      details: errors
    });
  }

  // MongoDB Duplicate Key Error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    return res.status(400).json({
      error: 'Dữ liệu đã tồn tại',
      field,
      message: `${field} đã được sử dụng`
    });
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token không hợp lệ'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token đã hết hạn'
    });
  }

  // Default Error
  res.status(500).json({
    error: 'Đã có lỗi xảy ra',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}; 