import type { RefObject } from 'react';
import type { ContentStats } from './states';

export interface Author {
  id: string;
  name: string;
  avatar?: string;
}

export interface HeaderData {
  author: Author;
  date: string;
  status: string;
  statusColor: string;
  isAuthor: boolean;
}

export interface ContentData {
  title: string;
  content: string;
  images?: string[];
  showContent: boolean;
  contentRef: RefObject<HTMLDivElement>;
}

export interface FooterData {
  stats: ContentStats;
  isLiked: boolean;
  isSaved: boolean;
  hasInteractions: boolean;
}

export interface QuickActionData {
  isStarred: boolean;
}

export interface CardData {
  className: string;
  onClick: () => void;
  'data-testid': string;
  'aria-disabled': boolean;
} 