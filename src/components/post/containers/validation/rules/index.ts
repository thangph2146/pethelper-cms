import type { ValidationRules } from '../types/validation-types';
import { validatePostTitle, validatePostContent, validatePostImages, validatePostContact, validatePostDate } from './post-rules';
import { validateUserName, validateUserEmail, validateAuthor } from './user-rules';
import { validateDescription, validateTags, validateLocation } from './content-rules';
import { validateLikes, validateComments, validateSaves } from './interaction-rules';

export const validationRules: ValidationRules = {
  post: {
    title: validatePostTitle,
    content: validatePostContent,
    images: validatePostImages,
    contact: validatePostContact,
    date: validatePostDate
  },
  user: {
    name: validateUserName,
    email: validateUserEmail,
    author: validateAuthor
  },
  content: {
    description: validateDescription,
    tags: validateTags,
    location: validateLocation
  },
  interaction: {
    likes: validateLikes,
    comments: validateComments,
    saves: validateSaves
  }
};

export * from './post-rules';
export * from './user-rules';
export * from './content-rules';
export * from './interaction-rules'; 