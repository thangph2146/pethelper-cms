import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình storage cho multer sử dụng Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pethelper', // tên folder trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  } as any
});

// Cấu hình upload
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    // Kiểm tra file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file hình ảnh!') as any, false);
    }
  }
});

// Middleware xử lý lỗi upload
const handleUploadError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    logger.error('Multer upload error:', err);
    return res.status(400).json({
      success: false,
      message: 'Lỗi upload file',
      error: err.message
    });
  }
  
  if (err) {
    logger.error('Upload error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Có lỗi xảy ra khi upload file'
    });
  }
  
  next();
};

export { upload, handleUploadError };