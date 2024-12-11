import { useState, useEffect, useRef } from 'react';
import { postApi } from '@/utils/axiosInstance';
import type { IPost } from '@/types/post';
import type { ApiResponse, PostsResponse, PostFilters } from '@/types/api';

export function usePosts(filters?: PostFilters) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    const fetchPosts = async () => {
      try {
        if (retryCount >= MAX_RETRIES) {
          throw new Error('Đã vượt quá số lần thử lại');
        }

        const response = await postApi.getAll(filters);
        
        if (!isMounted) return;

        if (response.data.success) {
          setPosts(response.data.data.posts);
          setPagination(response.data.data.pagination);
          setError(null);
        } else {
          throw new Error(response.data.message || 'Failed to fetch posts');
        }
      } catch (err: any) {
        if (!isMounted) return;

        console.error('Error fetching posts:', err);

        // Nếu là lỗi network hoặc 403, thử lại
        if ((err.code === 'ERR_NETWORK' || err.response?.status === 403) && retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(fetchPosts, RETRY_DELAY * retryCount);
          return;
        }

        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  return { posts, pagination, loading, error };
}

export function usePost(id: string) {
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController>();

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    const fetchPost = async () => {
      try {
        const response = await postApi.getOne(id, abortControllerRef.current?.signal || undefined );
        setPost(response.data.data);
        setLoading(false);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchPost();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id]);

  return { post, loading, error };
} 