import type { Post, PostRenderProps } from '@/types/post';
import type { LoadingProps } from '@/types/loading';
import type { CardData } from '../data';

// Content props
export interface ContentProps {
  cardProps: CardData;
  renderProps: PostRenderProps;
}

// Post content view props
export interface PostContentViewProps {
  header: {
    statusColor: string;
    urgencyColor: string;
    date: string;
  };
}

// Post content dialog props
export interface PostContentDialogProps {
  showDeleteAlert: boolean;
  showReportDialog: boolean;
  showComments: boolean;
  showShareDialog: boolean;
}

// Post content props
export interface PostContentProps {
  loading: LoadingProps;
  showPreview: boolean;
  post: Post;
  view: PostContentViewProps;
  dialogs: PostContentDialogProps;
  cardProps: CardData;
  renderProps: PostRenderProps;
} 