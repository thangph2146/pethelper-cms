import type { LoadingState, ContentStats } from './states';

export const getContentStats = (stats: Partial<ContentStats>): ContentStats => ({
  likes: stats.likes || 0,
  comments: stats.comments || 0,
  saves: stats.saves || 0,
  hasLiked: stats.hasLiked || false,
  hasSaved: stats.hasSaved || false
});

export const isAnyLoading = (loading: LoadingState): boolean => {
  return Object.values(loading).some(Boolean);
};

export const getTestId = (base: string, suffix?: string): string => {
  return suffix ? `${base}-${suffix}` : base;
}; 