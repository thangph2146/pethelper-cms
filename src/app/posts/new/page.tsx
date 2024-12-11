'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PostForm } from '@/components/PostForm';

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Đang tải...</div>;
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Đăng bài mới</h1>
        <PostForm />
      </div>
    </div>
  );
} 