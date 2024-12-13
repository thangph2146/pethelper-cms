import type { 
  ValidationResult,
  HeaderValidation,
  ContentValidation,
  FooterValidation,
  CardValidation,
  LoadingValidation
} from './validation-types';
import { getContentStats } from './utils';
import {
  getDefaultAuthor,
  getDefaultStats,
  getDefaultLoadingState,
  getDefaultCardData
} from './validation-helpers';
import {
  validateTitle,
  validateContent,
  validateImages
} from './validation-rules';
import {
  validateAuthor,
  validateStatus,
  validateStats
} from './validation-rules';

export const validateHeaderData = (data: Partial<HeaderValidation>): ValidationResult<HeaderValidation> => {
  const authorResult = validateAuthor(data.author || {});
  const statusResult = validateStatus(data.status || '');

  const errors = [
    ...authorResult.errors,
    ...statusResult.errors
  ];

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      author: authorResult.data,
      date: data.date || '',
      status: statusResult.data,
      statusColor: data.statusColor || '',
      isAuthor: data.isAuthor || false
    }
  };
};

export const validateContentData = (data: Partial<ContentValidation>): ValidationResult<ContentValidation> => {
  const titleResult = validateTitle(data.title || '');
  const contentResult = validateContent(data.content || '');
  const imagesResult = validateImages(data.images || []);

  const errors = [
    ...titleResult.errors,
    ...contentResult.errors,
    ...imagesResult.errors
  ];

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      title: titleResult.data,
      content: contentResult.data,
      images: imagesResult.data,
      showContent: data.showContent || false,
      contentRef: data.contentRef || { current: null }
    }
  };
};

export const validateFooterData = (data: Partial<FooterValidation>): ValidationResult<FooterValidation> => {
  const statsResult = validateStats(data.stats || {});

  return {
    isValid: statsResult.isValid,
    errors: statsResult.errors,
    data: {
      stats: statsResult.data,
      isLiked: data.isLiked || false,
      isSaved: data.isSaved || false,
      hasInteractions: data.hasInteractions || false
    }
  };
};

export const validateCardData = (data: Partial<CardValidation>): ValidationResult<CardValidation> => ({
  isValid: true,
  errors: [],
  data: {
    ...getDefaultCardData(),
    ...data
  }
});

export const validateLoadingState = (loading: Partial<LoadingValidation>): ValidationResult<LoadingValidation> => ({
  isValid: true,
  errors: [],
  data: {
    ...getDefaultLoadingState(),
    ...loading
  }
}); 