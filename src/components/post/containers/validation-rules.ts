import type { ValidationResult } from './validation-types';
import type { AuthorValidation } from './validation-types';
import { VALIDATION_MESSAGES, VALIDATION_LIMITS } from './constants';
import { ContentStats } from './states';
import { VALIDATION_ERRORS } from './validation-errors';
import {
  combineValidationResults,
  createValidationResult,
  validateRequired,
  validateLength
} from './validation-utils';
import { createValidationContext } from './validation-patterns/validation-context';

export const validateAuthor = (author?: Partial<AuthorValidation>): ValidationResult<AuthorValidation> => {
  const errors: string[] = [];

  if (!author?.id) {
    errors.push(VALIDATION_MESSAGES.author.idRequired);
  }
  if (!author?.name) {
    errors.push(VALIDATION_MESSAGES.author.nameRequired);
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      id: author?.id || '',
      name: author?.name || '',
      avatar: author?.avatar
    }
  };
};

export const validateStatus = (status: string): ValidationResult<string> => {
  const errors: string[] = [];

  if (!VALID_POST_STATUSES.includes(status as any)) {
    errors.push(VALIDATION_MESSAGES.status.invalid);
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: status || VALID_POST_STATUSES[0]
  };
};

export const validateStats = (stats: Partial<ContentStats>): ValidationResult<ContentStats> => {
  const errors: string[] = [];
  
  // Validate likes
  if (stats.likes && stats.likes > VALIDATION_LIMITS.stats.maxLikes) {
    errors.push(VALIDATION_MESSAGES.stats.invalidLikes);
  }

  // Validate comments
  if (stats.comments && stats.comments > VALIDATION_LIMITS.stats.maxComments) {
    errors.push(VALIDATION_MESSAGES.stats.invalidComments);
  }

  // Validate saves
  if (stats.saves && stats.saves > VALIDATION_LIMITS.stats.maxSaves) {
    errors.push(VALIDATION_MESSAGES.stats.invalidSaves);
  }

  const validatedStats = {
    likes: Math.min(Math.max(0, stats.likes || 0), VALIDATION_LIMITS.stats.maxLikes),
    comments: Math.min(Math.max(0, stats.comments || 0), VALIDATION_LIMITS.stats.maxComments),
    saves: Math.min(Math.max(0, stats.saves || 0), VALIDATION_LIMITS.stats.maxSaves),
    hasLiked: Boolean(stats.hasLiked),
    hasSaved: Boolean(stats.hasSaved)
  };

  return {
    isValid: errors.length === 0,
    errors,
    data: validatedStats
  };
};

export const validateTitle = (
  title: string,
  options?: ValidationOptions
): ValidationResult<string> => {
  const context = createValidationContext('Tiêu đề')
    .withOptions(options || {})
    .build();

  const requiredResult = validateRequired(title, context.field, options);
  if (!requiredResult.isValid) {
    return requiredResult;
  }

  const lengthResult = validateLength(
    title,
    context.field,
    VALIDATION_LIMITS.content.title.min,
    VALIDATION_LIMITS.content.title.max,
    options
  );

  return combineValidationResults(
    [requiredResult, lengthResult],
    ([title]) => title,
    context
  );
};

export const validateContent = (content: string): ValidationResult<string> => {
  const errors: string[] = [];

  if (!content) {
    errors.push(VALIDATION_MESSAGES.required.content);
  }
  if (content && content.length < VALIDATION_LIMITS.content.body.min) {
    errors.push(VALIDATION_MESSAGES.length.content.min);
  }
  if (content && content.length > VALIDATION_LIMITS.content.body.max) {
    errors.push(VALIDATION_MESSAGES.length.content.max);
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: content || ''
  };
};

export const validateImages = (images: string[]): ValidationResult<string[]> => {
  const errors: string[] = [];

  if (images.length > VALIDATION_LIMITS.media.images) {
    errors.push(VALIDATION_ERRORS.limit.maxCount('hình ảnh', VALIDATION_LIMITS.media.images));
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: images || []
  };
};

export const validateBooleanField = (value: unknown, fieldName: string): ValidationResult<boolean> => {
  const errors: string[] = [];
  const validatedValue = Boolean(value);

  return {
    isValid: true,
    errors,
    data: validatedValue
  };
};

export const validateFooterData = (data: Partial<FooterValidation>): ValidationResult<FooterValidation> => {
  const results = {
    stats: validateStats(data.stats || {}),
    isLiked: validateBooleanField(data.isLiked, 'isLiked'),
    isSaved: validateBooleanField(data.isSaved, 'isSaved'),
    hasInteractions: validateBooleanField(data.hasInteractions, 'hasInteractions')
  };

  return combineValidationResults(
    Object.values(results),
    ([stats, isLiked, isSaved, hasInteractions]) => ({
      stats,
      isLiked,
      isSaved,
      hasInteractions
    })
  );
}; 