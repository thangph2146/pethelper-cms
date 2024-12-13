import { useMemo } from 'react';
import type { PostMotionProps } from '@/types/post';
import { POST_ANIMATION } from '@/constants/post-animation';
import { POST_CONFIG } from '@/constants/post-config';

interface UsePostAnimationParams {
  motionProps: PostMotionProps;
  isDisabled?: boolean;
}

export const usePostAnimation = ({
  motionProps,
  isDisabled = false
}: UsePostAnimationParams) => {
  return useMemo(() => ({
    motionProps: {
      ...motionProps,
      'data-testid': POST_CONFIG.testIds.motion,
      animate: POST_ANIMATION.animate,
      initial: POST_ANIMATION.initial,
      exit: POST_ANIMATION.exit,
      transition: POST_ANIMATION.transition,
      whileHover: isDisabled ? undefined : POST_ANIMATION.hover
    }
  }), [motionProps, isDisabled]);
}; 