import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const PostSchema = z.object({
  title: z.string()
    .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
    .max(200, 'Tiêu đề không được quá 200 ký tự')
    .trim(),
  description: z.string()
    .min(20, 'Mô tả phải có ít nhất 20 ký tự')
    .trim(),
  animalType: z.enum(['DOG', 'CAT', 'OTHER'], {
    errorMap: () => ({ message: 'Loại động vật không hợp lệ' })
  }),
  location: z.string()
    .min(1, 'Vui lòng nhập địa điểm')
    .trim(),
  urgency: z.enum(['HIGH', 'MEDIUM', 'LOW'], {
    errorMap: () => ({ message: 'Mức độ khẩn cấp không hợp lệ' })
  }),
  images: z.array(
    z.string()
      .url('URL ảnh không hợp lệ')
      .regex(/\.(jpg|jpeg|png|gif)$/i, 'Định dạng ảnh không hợp lệ')
  ).optional(),
  contactInfo: z.object({
    name: z.string()
      .min(1, 'Vui lòng nhập tên')
      .trim(),
    phone: z.string()
      .regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
      .trim(),
    email: z.string()
      .email('Email không hợp lệ')
      .trim()
      .toLowerCase()
  })
});

export const validatePost = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = PostSchema.parse(req.body);
    req.body = validatedData; // Replace request body with validated data
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dữ liệu không hợp lệ',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      next(error);
    }
  }
};

export const validatePartialPost = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = PostSchema.partial().parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Dữ liệu không hợp lệ',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      next(error);
    }
  }
};

const RegisterSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').trim(),
  email: z.string().email('Email không hợp lệ').trim().toLowerCase(),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ').optional()
});

const LoginSchema = z.object({
  email: z.string().email('Email không hợp lệ').trim().toLowerCase(),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

const PasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
});

export const validateRegister = createValidator(RegisterSchema);
export const validateLogin = createValidator(LoginSchema);
export const validatePassword = createValidator(PasswordSchema);

function createValidator(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Dữ liệu không hợp lệ',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      } else {
        next(error);
      }
    }
  };
} 