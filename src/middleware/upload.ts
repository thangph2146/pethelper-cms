import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import type { StorageEngine, Options, Multer, FileFilterCallback } from 'multer';
import { ValidationError } from './error';

interface UploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
}

const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request, 
    file: Express.Multer.File, 
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, 'uploads/');
  },
  filename: (
    req: Request, 
    file: Express.Multer.File, 
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const fileFilter = (options: UploadOptions = {}) => {
  return (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const { allowedTypes = ['image/jpeg', 'image/png'] } = options;

    if (!allowedTypes.includes(file.mimetype)) {
      callback(new ValidationError('Định dạng file không được hỗ trợ'));
      return;
    }

    callback(null, true);
  };
};

export const upload = (options: UploadOptions = {}): Multer => {
  const { maxSize = 5 * 1024 * 1024 } = options; // Default 5MB

  const multerOptions: Options = {
    storage,
    fileFilter: fileFilter(options),
    limits: {
      fileSize: maxSize
    }
  };

  return multer(multerOptions);
};

export const handleUploadError = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return next(new ValidationError('File quá lớn'));
      case 'LIMIT_FILE_COUNT':
        return next(new ValidationError('Số lượng file vượt quá giới hạn'));
      default:
        return next(new ValidationError('Lỗi khi upload file'));
    }
  }
  
  next(err);
};