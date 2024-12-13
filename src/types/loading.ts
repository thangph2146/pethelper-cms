export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  status: 'loading' | 'error' | 'success';
}

export interface LoadingProps {
  isLoading: boolean;
  'aria-busy': boolean;
  'data-loading': boolean;
  'data-error': boolean;
}

export interface LoadingStateProps extends LoadingProps {
  children: React.ReactNode;
  'data-testid'?: string;
}

export interface LoadingContainerProps extends LoadingProps {
  'data-testid'?: string;
  children: React.ReactNode;
} 