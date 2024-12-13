import type { MouseEvent } from 'react';

export interface HeaderHandlers {
  onMenuAction: (action: string) => void;
}

export interface ContentDataHandlers {
  toggleContent: () => void;
  onImageClick: (image: string) => void;
}

export interface FooterHandlers {
  onLike: (e: MouseEvent) => Promise<void>;
  onComment: () => void;
  onSave: (e: MouseEvent) => Promise<void>;
  onShare: () => Promise<void>;
}

export interface QuickActionHandlers {
  onQuickView: (e: MouseEvent) => void;
  onStar: (e: MouseEvent) => Promise<void>;
}

export interface ContentHandlers {
  header: HeaderHandlers;
  content: ContentDataHandlers;
  footer: FooterHandlers;
  quickActions: QuickActionHandlers;
} 