import type { ReactNode } from 'react';
import type { PostMotionProps } from '@/types/post';
import type { LoadingProps } from '@/types/loading';
import type { ContentProps } from './content-types';

// Base container props
export interface ContainerBaseProps {
  'data-testid'?: string;
  children: ReactNode;
}

// Error handling props
export interface ContainerErrorProps {
  onReset: () => void;
  onError: (error: Error) => void;
}

// Main container props
export interface BaseContainerProps {
  errorProps: ContainerErrorProps;
  loadingProps: LoadingProps;
  motionProps: PostMotionProps;
  contentProps: ContentProps;
} 