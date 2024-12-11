import type { IPost } from '@backend/models/Post';

export interface Author {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export interface AdminPost extends Omit<IPost, 'author'> {
  author: Author;
} 