import { memo } from 'react';
import { motion } from 'framer-motion';
import type { MotionContainerProps } from './container-types';

export const PostMotionContainer = memo(({
  motionProps,
  children
}: MotionContainerProps) => {
  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  );
});

PostMotionContainer.displayName = 'PostMotionContainer'; 