import { z } from 'zod';

// Schema cho bài đăng
export const postSchema = z.object({
  title: z.string().min(10, 'Tiêu đề phải có ít nhất 10 ký tự'),
  description: z.string().min(50, 'Mô tả phải có ít nhất 50 ký tự'),
  type: z.enum(['dog', 'cat', 'other']),
  status: z.enum(['cần_giúp_đỡ', 'đang_hỗ_trợ', 'đã_giải_quyết']),
  urgency: z.enum(['cao', 'trung_bình', 'thấp']),
  location: z.string().min(5, 'Vui lòng nhập địa điểm'),
  contactInfo: z.string().min(10, 'Vui lòng nhập thông tin liên hệ'),
  images: z.array(z.string()).min(1, 'Vui lòng tải lên ít nhất 1 ảnh')
});

export type PostInput = z.infer<typeof postSchema>;

// Schema cho comment
export const commentSchema = z.object({
  content: z.string().min(1, 'Nội dung không được để trống')
});

export type CommentInput = z.infer<typeof commentSchema>;

// Schema cho user
export const userSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  role: z.enum(['user', 'admin']).default('user')
});

export type UserInput = z.infer<typeof userSchema>; 