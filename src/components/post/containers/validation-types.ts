import type { RefObject } from 'react';
import type { ContentStats, LoadingState } from './states';

export interface ValidationResult<T> {
  isValid: boolean;
  errors: string[];
  data: T;
}

export interface AuthorValidation {
  id: string;
  name: string;
  avatar?: string;
}

export interface HeaderValidation {
  author: AuthorValidation;
  date: string;
  status: string;
  statusColor: string;
  isAuthor: boolean;
}

export interface ContentValidation {
  title: string;
  content: string;
  images: string[];
  showContent: boolean;
  contentRef: RefObject<HTMLDivElement>;
}

export interface FooterValidation {
  stats: ContentStats;
  isLiked: boolean;
  isSaved: boolean;
  hasInteractions: boolean;
}

export interface CardValidation {
  className: string;
  onClick: () => void;
  'data-testid': string;
  'aria-disabled': boolean;
}

export interface LoadingValidation extends LoadingState {} 