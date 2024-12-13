import { VALIDATION_DEFAULTS } from '../../validation-patterns';
import { createValidationContext } from '../validation-context';
import { createRequiredRule, createLengthRule, createCompositeRule } from '../validation-rules';
import { createArrayLengthRule, createArrayItemsRule } from './array-rules';
import { createPatternRule } from '../validation-rules';
import type { ValidationResult } from '../types/validation-interfaces';
import type { IPost } from '@/types/post';
import { createValidationMessages } from '../validation-message-utils';
import { validateContactInfo } from '../contact-validation';
import { validateDate } from '../date-validation';
import { validateLength, validateRequired } from '../field-validation';

export const validatePostTitle = (title: string): ValidationResult<string> => {
  const context = createValidationContext('title', {
    parent: 'post',
    required: true
  });

  const { min, max } = VALIDATION_DEFAULTS.length.title;

  const titleRule = createCompositeRule([
    createRequiredRule<string>(),
    createLengthRule(min, max)
  ]);

  return titleRule.validate(title, context);
};

export const validatePostContent = (content: string): ValidationResult<string> => {
  const { min, max } = VALIDATION_DEFAULTS.length.content;
  const required = validateRequired(content, 'Nội dung');
  
  if (!required.isValid) return required;

  const lengthErrors = validateLength(content, 'Nội dung', min, max);
  return {
    isValid: lengthErrors.length === 0,
    messages: createValidationMessages(lengthErrors),
    data: content
  };
};

export const validatePostImages = (images: string[]): ValidationResult<string[]> => {
  const context = createValidationContext('images', {
    parent: 'post'
  });

  const { max } = VALIDATION_DEFAULTS.array.images;

  const imageUrlRule = createPatternRule(
    /\.(jpg|jpeg|png|gif|webp)$/i,
    'URL ảnh không hợp lệ'
  );

  const imagesRule = createCompositeRule([
    createArrayLengthRule(max),
    createArrayItemsRule(imageUrlRule)
  ]);

  return imagesRule.validate(images, context);
};

export const validatePostContact = (contact: IPost['contact']): ValidationResult<IPost['contact']> => {
  return validateContactInfo(contact, 'Thông tin liên hệ');
};

export const validatePostDate = (date: string): ValidationResult<string> => {
  const errors = validateDate(date, 'Ngày đăng');
  return {
    isValid: errors.length === 0,
    messages: createValidationMessages(errors),
    data: date
  };
}; 