import { useState } from 'react';
import { UserService } from '@/services/user.service';
import { toast } from 'react-hot-toast';

interface SavePostButtonProps {
  postId: string;
  initialSaved?: boolean;
}

export const SavePostButton = ({ postId, initialSaved = false }: SavePostButtonProps) => {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      if (saved) {
        await UserService.unsavePost(postId);
        toast.success('Đã bỏ lưu bài đăng');
      } else {
        await UserService.savePost(postId);
        toast.success('Đã lưu bài đăng');
      }
      setSaved(!saved);
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        saved
          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={saved ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {saved ? 'Đã lưu' : 'Lưu bài'}
    </button>
  );
}; 