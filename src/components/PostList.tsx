'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { usePostService } from '@/hooks/use-post-service';
import { useState, useCallback, useTransition, memo, useMemo } from 'react';
import { PostCardSkeleton } from '@/components/PostCardSkeleton';
import { RefreshCw, Filter, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { PostFilters } from '@/types/post';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { SearchFilters } from '@/components/SearchFilters';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { useReadPosts } from '@/hooks/use-read-posts';
import { useStarredPosts } from '@/hooks/use-starred-posts';
import { format, isToday, isYesterday, isSameWeek, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';

const MemoizedPostCard = memo(PostCard);

export function PostList() {
  const { getPosts } = usePostService();
  const [filters, setFilters] = useState<PostFilters>({});
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [isPending, startTransition] = useTransition();
  const debouncedFilters = useDebounce(filters, 500);
  const { readPosts } = useReadPosts();
  const { starredPosts } = useStarredPosts();
  const { user } = useAuth();
  const [showInteractionFilters, setShowInteractionFilters] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['posts', debouncedFilters, sortBy],
    queryFn: ({ pageParam = 1 }) => getPosts({ 
      page: pageParam, 
      limit: 10,
      ...debouncedFilters,
      sort: sortBy
    }),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.hasMore) return undefined;
      return pages.length + 1;
    },
    staleTime: 1000 * 60 // 1 phút
  });

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleFilterChange = useCallback((newFilters: Partial<PostFilters>) => {
    startTransition(() => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    });
  }, []);

  const handleInteractionFilterChange = (type: 'liked' | 'commented' | 'saved') => {
    handleFilterChange({
      interaction: filters.interaction === type ? undefined : type
    });
  };

  const handleSortChange = useCallback((value: 'latest' | 'popular') => {
    setSortBy(value);
  }, []);

  const posts = data?.pages.flatMap(page => page.data) ?? [];
  const totalPosts = data?.pages[0]?.total ?? 0;

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    if (filters.readStatus === 'read') {
      filtered = filtered.filter(post => readPosts.includes(post.id));
    } else if (filters.readStatus === 'unread') {
      filtered = filtered.filter(post => !readPosts.includes(post.id));
    }

    if (filters.starred) {
      filtered = filtered.filter(post => starredPosts.includes(post.id));
    }

    return filtered;
  }, [posts, filters.readStatus, filters.starred, readPosts, starredPosts]);

  const groupedPosts = useMemo(() => {
    const groups = filteredPosts.reduce((acc, post) => {
      const date = parseISO(post.created_at);
      let key = '';

      if (isToday(date)) {
        key = 'Hôm nay';
      } else if (isYesterday(date)) {
        key = 'Hôm qua';
      } else if (isSameWeek(date, new Date())) {
        key = 'Tuần này';
      } else {
        key = format(date, 'MMMM yyyy', { locale: vi });
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(post);
      return acc;
    }, {} as Record<string, typeof filteredPosts>);

    return Object.entries(groups).sort((a, b) => {
      const order = ['Hôm nay', 'Hôm qua', 'Tuần này'];
      const aIndex = order.indexOf(a[0]);
      const bIndex = order.indexOf(b[0]);
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });
  }, [filteredPosts]);

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">
          Đã có lỗi xảy ra khi tải danh sách bài đăng
        </p>
        <Button onClick={handleRefresh} variant="outline">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {!isLoading && totalPosts > 0 && (
              <span className="animate-in fade-in">
                {totalPosts} bài viết
              </span>
            )}
          </p>
          <Button 
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            disabled={isFetching}
            className="relative"
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-2 transition-transform",
              isFetching && "animate-spin"
            )} />
            Làm mới
            {isPending && (
              <div className="absolute inset-0 bg-background/50 rounded-md" />
            )}
          </Button>
        </div>

        <div className="w-full sm:w-auto">
          <SearchFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <Filter className="h-4 w-4 mr-2" />
              {sortBy === 'latest' ? 'Mới nhất' : 'Phổ biến nhất'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleSortChange('latest')}
              className={cn(
                "cursor-pointer",
                sortBy === 'latest' && "bg-accent"
              )}
            >
              Mới nhất
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleSortChange('popular')}
              className={cn(
                "cursor-pointer",
                sortBy === 'popular' && "bg-accent"
              )}
            >
              Phổ biến nhất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {user && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleInteractionFilterChange('liked')}
              className={cn(
                "gap-2",
                filters.interaction === 'liked' && "bg-red-50 text-red-600 border-red-200"
              )}
            >
              <Heart className={cn(
                "h-4 w-4",
                filters.interaction === 'liked' && "fill-current"
              )} />
              <span className="hidden sm:inline">Đã thích</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleInteractionFilterChange('commented')}
              className={cn(
                "gap-2",
                filters.interaction === 'commented' && "bg-blue-50 text-blue-600 border-blue-200"
              )}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Đã bình luận</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleInteractionFilterChange('saved')}
              className={cn(
                "gap-2",
                filters.interaction === 'saved' && "bg-yellow-50 text-yellow-600 border-yellow-200"
              )}
            >
              <Bookmark className={cn(
                "h-4 w-4",
                filters.interaction === 'saved' && "fill-current"
              )} />
              <span className="hidden sm:inline">Đã lưu</span>
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {isLoading ? (
          <div className="space-y-4 animate-in fade-in">
            {Array(3).fill(0).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : !filteredPosts.length ? (
          <div className="text-center py-8 text-gray-500 animate-in fade-in">
            {Object.keys(filters).length > 0 
              ? 'Không tìm thấy bài viết nào phù hợp'
              : 'Chưa có bài đăng nào'
            }
          </div>
        ) : (
          <div className="animate-in fade-in">
            {groupedPosts.map(([date, posts]) => (
              <div key={date} className="space-y-4">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
                  <h2 className="text-sm font-medium text-muted-foreground">
                    {date}
                  </h2>
                </div>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <MemoizedPostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            ))}

            <div ref={ref} className="h-4" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Spinner size="lg" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 