import { useState, useRef, useCallback } from 'react';

export interface UsePostContent {
  showContent: boolean;
  toggleContent: () => void;
  contentRef: React.RefObject<HTMLDivElement>;
}

export const usePostContent = (): UsePostContent => {
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleContent = useCallback(() => {
    setShowContent(prev => !prev);
  }, []);

  return {
    showContent,
    toggleContent,
    contentRef
  };
}; 