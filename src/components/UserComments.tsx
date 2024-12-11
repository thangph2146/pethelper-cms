import { useState, useEffect } from 'react';
import { UserService } from '@/services/user.service';
import Link from 'next/link';

interface Comment {
  _id: string;
  content: string;
  postId: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

export const UserComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await UserService.getUserComments();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Bạn chưa có bình luận nào
        </p>
      ) : (
        comments.map(comment => (
          <div key={comment._id} className="bg-white rounded-lg shadow p-4">
            <Link 
              href={`/posts/${comment.postId._id}`}
              className="font-medium hover:text-blue-600"
            >
              {comment.postId.title}
            </Link>
            <p className="mt-2 text-gray-600">{comment.content}</p>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        ))
      )}
    </div>
  );
}; 