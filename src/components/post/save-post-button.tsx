'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { PostService } from '@/services/post.service';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SavePostButtonProps {
  postId: string;
  isSaved?: boolean;
}

export function SavePostButton({ postId, isSaved = false }: SavePostButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleClick = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      setIsSubmitting(true);
      if (saved) {
        await PostService.unsavePost(postId);
      } else {
        await PostService.savePost(postId);
      }
      setSaved(!saved);
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isSubmitting}
      className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
        saved
          ? 'bg-indigo-100 text-indigo-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {isSubmitting ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="h-5 w-5" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
      <span>{saved ? 'Đã lưu' : 'Lưu bài'}</span>
    </button>
  );
} 