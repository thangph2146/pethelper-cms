'use client';

import { usePost } from '@/hooks/use-post';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { PostComment } from '@/components/post/post-comment';
import { SavePostButton } from '@/components/post/save-post-button';
import Image from 'next/image';
import { format } from 'date-fns';
import { MapPin, User } from 'lucide-react';

const statusText = {
  need_help: 'Cần giúp đỡ',
  helping: 'Đang giúp đỡ',
  helped: 'Đã được giúp đỡ',
} as const;

const statusColors = {
  need_help: 'bg-red-100 text-red-800',
  helping: 'bg-yellow-100 text-yellow-800',
  helped: 'bg-green-100 text-green-800',
} as const;

const animalTypeText = {
  dog: 'Chó',
  cat: 'Mèo',
  other: 'Khác',
} as const;

export default function PostDetail() {
  const { id } = useParams();
  const { data: post, isLoading, error, refetch } = usePost(id as string);

  if (isLoading) return <Spinner />;
  if (error) return <div>Đã có lỗi xảy ra</div>;
  if (!post) return <div>Không tìm thấy bài viết</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {post.author.name}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {post.location}
              </div>
              <span>
                {format(new Date(post.createdAt), 'dd/MM/yyyy')}
              </span>
            </div>
          </div>
          <SavePostButton postId={post._id} />
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {post.images.length > 0 && (
            <div className="relative aspect-video">
              <Image
                src={post.images[0]}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[post.status]}`}>
                {statusText[post.status]}
              </span>
              <span className="text-sm text-gray-600">
                {animalTypeText[post.animalType]}
              </span>
            </div>
            <div className="prose max-w-none">
              <p>{post.content}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{post.contactInfo}</p>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <PostComment
            postId={post._id}
            comments={post.comments}
            onCommentAdded={() => refetch()}
          />
        </div>
      </div>
    </div>
  );
} 