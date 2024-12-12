import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserService } from '@/services/client/user.service';
import { IComment } from '@backend/models/Comment';
import { IPost } from '@backend/models/Post';

export const UserComments = () => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { getUserComments } = useUserService();

  useEffect(() => {
    const fetchComments = async () => {
      try {
            const data = await getUserComments();
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
          <div key={comment._id as string} className="bg-white rounded-lg shadow p-4">
              <Link 
              href={`/posts/${comment.post._id}`}
              className="font-medium hover:text-blue-600"
            >
              {(comment.post as IPost).title}
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