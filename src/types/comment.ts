import type { IUser } from './user';

export interface IComment {
  _id: string;
  post: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateCommentInput = Pick<IComment, 'content'>; 