export const POST_ANIMATION = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -20
  },
  transition: {
    duration: 0.2,
    ease: 'easeInOut'
  },
  hover: {
    scale: 1.01,
    transition: {
      duration: 0.2
    }
  }
} as const; 