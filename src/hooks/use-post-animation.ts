import { useState } from 'react';

export const usePostAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2 },
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  };

  return {
    isHovered,
    motionProps
  };
}; 