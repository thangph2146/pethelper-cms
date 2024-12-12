import { useState, useCallback } from 'react';
import type { MotionProps } from 'framer-motion';

export interface UsePostAnimation {
  isHovered: boolean;
  motionProps: MotionProps;
}

export const usePostAnimation = (): UsePostAnimation => {
  const [isHovered, setIsHovered] = useState(false);

  const motionProps: MotionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2 },
    onHoverStart: useCallback(() => setIsHovered(true), []),
    onHoverEnd: useCallback(() => setIsHovered(false), [])
  };

  return {
    isHovered,
    motionProps
  };
}; 