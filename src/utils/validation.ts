import { z } from 'zod';
import type { ValidationError } from '@/types/error';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  password: z.string().regex(
    passwordRegex,
    'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
  ),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  newPassword: z.string().regex(
    passwordRegex,
    'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
  ),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
});

export const validateForm = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: boolean; data?: T; errors?: ValidationError[] }> => {
  try {
    const validData = await schema.parseAsync(data);
    return { success: true, data: validData };
  } catch (zodError) {
    if (zodError instanceof z.ZodError) {
      const errors = zodError.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }));
        return { success: false, errors };
      }
    throw zodError;
  }
};
