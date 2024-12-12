import { PostService } from '@/services/post.service';
import { useCallback } from 'react';
import type { PostFilters, PostsResponse } from '@/types/post';

export interface GetPostsParams extends PostFilters {
  page?: number;
  sort?: 'latest' | 'popular';
}

export function usePostService() {
  const getPosts = useCallback(async (params: GetPostsParams): Promise<PostsResponse> => {
    const searchParams = new URLSearchParams();

    if (params.keyword) {
      searchParams.append('keyword', params.keyword);
    }
    if (params.type) {
      searchParams.append('type', params.type);
    }
    if (params.status) {
      searchParams.append('status', params.status);
    }
    if (params.urgency) {
      searchParams.append('urgency', params.urgency);
    }
    if (params.distance) {
      searchParams.append('distance', params.distance.toString());
    }
    if (params.timeRange) {
      searchParams.append('timeRange', params.timeRange);
    }
    if (params.dateFrom) {
      searchParams.append('dateFrom', params.dateFrom);
    }
    if (params.dateTo) {
      searchParams.append('dateTo', params.dateTo);
    }
    if (params.interaction) {
      searchParams.append('interaction', params.interaction);
    }
    if (params.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params.sort) {
      searchParams.append('sort', params.sort);
    }

    const response = await PostService.getAllPosts(
      params.page || 1,
      searchParams.toString()
    );
    return response as PostsResponse;
  }, []);

  const getInteractionStats = useCallback(async (postId: string) => {
    return await PostService.getInteractionStats(postId);
  }, []);

  return {
    getPosts,
    getInteractionStats,
    likePost: PostService.likePost,
    unlikePost: PostService.unlikePost,
    savePost: PostService.savePost,
    unsavePost: PostService.unsavePost,
    deletePost: PostService.deletePost
  };
} 