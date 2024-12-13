export interface LoadingState {
  isLoading: boolean;
  isDeleting: boolean;
  isLikeLoading: boolean;
  isSaving: boolean;
  isStarring: boolean;
  isSharing: boolean;
  isReporting: boolean;
}

export interface ContentStats {
  likes: number;
  comments: number;
  saves: number;
  hasLiked: boolean;
  hasSaved: boolean;
} 