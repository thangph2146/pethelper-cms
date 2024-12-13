import type { IPost } from '@/types/post';
import type { ValidationResult } from './validation-interfaces';

export interface PostValidationRules {
  title: (title: string) => ValidationResult<string>;
  content: (content: string) => ValidationResult<string>;
  images: (images: string[]) => ValidationResult<string[]>;
  contact: (contact: IPost['contact']) => ValidationResult<IPost['contact']>;
  date: (date: string) => ValidationResult<string>;
}

export interface UserValidationRules {
  name: (name: string) => ValidationResult<string>;
  email: (email: string) => ValidationResult<string>;
  author: (author: IPost['author']) => ValidationResult<IPost['author']>;
}

export interface ContentValidationRules {
  description: (description: string) => ValidationResult<string>;
  tags: (tags: string[]) => ValidationResult<string[]>;
  location: (location: string) => ValidationResult<string>;
}

export interface InteractionValidationRules {
  likes: (count: number) => ValidationResult<number>;
  comments: (count: number) => ValidationResult<number>;
  saves: (count: number) => ValidationResult<number>;
}

export interface ValidationRules {
  post: PostValidationRules;
  user: UserValidationRules;
  content: ContentValidationRules;
  interaction: InteractionValidationRules;
} 