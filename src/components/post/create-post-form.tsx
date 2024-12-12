'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PostService } from '@/services/post.service';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ImageUpload } from './image-upload';

const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  animalType: z.enum(['dog', 'cat', 'other']),
  location: z.string().min(1, 'Địa điểm là bắt buộc'),
  contactInfo: z.string().min(1, 'Thông tin liên hệ là bắt buộc'),
  images: z.array(z.string()).default([]),
  status: z.enum(['need_help', 'helping', 'helped']).default('need_help'),
});

type PostFormData = z.infer<typeof postSchema>;

export function CreatePostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      status: 'need_help'
    }
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      setIsSubmitting(true);
      await PostService.createPost({
        ...data,
        images,
      });
      toast.success('Tạo bài đăng thành công');
      router.push('/posts');
    } catch (error: Error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi tạo bài đăng');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tiêu đề
        </label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Loại động vật
        </label>
        <select
          {...register('animalType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="dog">Chó</option>
          <option value="cat">Mèo</option>
          <option value="other">Khác</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nội dung
        </label>
        <textarea
          {...register('content')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Địa điểm
        </label>
        <input
          type="text"
          {...register('location')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Thông tin liên hệ
        </label>
        <input
          type="text"
          {...register('contactInfo')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.contactInfo && (
          <p className="mt-1 text-sm text-red-600">{errors.contactInfo.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Trạng thái
        </label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="need_help">Cần giúp đỡ</option>
          <option value="helping">Đang giúp đỡ</option>
          <option value="helped">Đã được giúp đỡ</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Hình ảnh
        </label>
        <ImageUpload
          value={images}
          onChange={setImages}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isSubmitting ? 'Đang tạo...' : 'Tạo bài đăng'}
      </button>
    </form>
  );
} 