import { useMemo } from 'react';
import { usePostAnimationState } from '../use-post-animation-state';

interface AnimationProps {
  isDisabled: boolean;
  isLoading: boolean;
}

export const usePostAnimationProps = ({
  isDisabled,
  isLoading
}: AnimationProps) => {
  const animationProps = useMemo(() => ({
    isDisabled,
    isLoading
  }), [isDisabled, isLoading]);

  const { motionProps } = usePostAnimationState(animationProps);

  return {
    motionProps
  };
}; 