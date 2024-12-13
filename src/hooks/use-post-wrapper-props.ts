import { useMemo } from 'react';
import { POST_CONFIG } from '@/constants/post-config';
import { POST_MESSAGES } from '@/constants/post-messages';

interface UsePostWrapperPropsParams {
  authorName: string;
  isLoading: boolean;
}

export const usePostWrapperProps = ({
  authorName,
  isLoading
}: UsePostWrapperPropsParams) => {
  return useMemo(() => ({
    'data-testid': POST_CONFIG.testIds.wrapper,
    role: 'article',
    'aria-label': POST_MESSAGES.aria.post(authorName),
    'aria-busy': isLoading,
    className: 'relative'
  }), [authorName, isLoading]);
}; 