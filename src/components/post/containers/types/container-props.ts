import type { ContainerBaseProps, ContainerErrorProps, BaseContainerProps } from './base-types';
import type { ContentProps } from './content-types';
import type { PostMotionProps } from '@/types/post';
import type { LoadingProps } from '@/types/loading';

// Container specific props
export interface PostWrapperProps {
  wrapperProps: Record<string, unknown>;
  errorProps: ContainerErrorProps;
  loadingProps: LoadingProps;
  motionProps: PostMotionProps;
  contentProps: ContentProps;
  'data-testid'?: string;
}

export interface ErrorContainerProps extends ContainerBaseProps {
  errorProps: ContainerErrorProps;
}

export interface MotionContainerProps extends ContainerBaseProps {
  motionProps: PostMotionProps;
}

export interface LoadingContainerProps extends LoadingProps, ContainerBaseProps {}

export interface PostContainerProps extends BaseContainerProps {} 