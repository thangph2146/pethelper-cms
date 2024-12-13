import type { ContentStats } from './states';

export const getDefaultAuthor = () => ({
  id: '',
  name: '',
  avatar: undefined
});

export const getDefaultStats = (): ContentStats => ({
  likes: 0,
  comments: 0,
  saves: 0,
  hasLiked: false,
  hasSaved: false
});

export const getDefaultLoadingState = () => ({
  isLoading: false,
  isDeleting: false,
  isLikeLoading: false,
  isSaving: false,
  isStarring: false,
  isSharing: false,
  isReporting: false
});

export const getDefaultCardData = () => ({
  className: '',
  onClick: () => {},
  'data-testid': '',
  'aria-disabled': false
}); 