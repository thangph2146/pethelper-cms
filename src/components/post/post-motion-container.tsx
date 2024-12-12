import { memo } from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

interface PostMotionContainerProps {
  motionProps: MotionProps;
  children: React.ReactNode;
}

export const PostMotionContainer = memo(({
  motionProps,
  children
}: PostMotionContainerProps) => {
  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  );
});

PostMotionContainer.displayName = 'PostMotionContainer'; 