import { useState, useRef } from 'react';

export const usePostContent = () => {
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleContent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContent(!showContent);
  };

  return {
    showContent,
    contentRef,
    toggleContent
  };
}; 