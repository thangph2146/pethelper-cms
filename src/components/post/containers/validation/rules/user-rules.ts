import { VALIDATION_DEFAULTS } from '../../validation-patterns';
import { validateRequired, validateLength } from '../field-validation';
import { validateEmail } from '../contact-validation';
import { createValidationMessages } from '../validation-message-utils';
import type { ValidationResult } from '../../validation-patterns/interfaces/validation-types';
import type { IPost } from '@/types/post';

export const validateUserName = (name: string): ValidationResult<string> => {
  const required = validateRequired(name, 'Tên người dùng');
  if (!required.isValid) return required;

  const { min, max } = VALIDATION_DEFAULTS.length.name;
  const lengthErrors = validateLength(name, 'Tên người dùng', min, max);

  return {
    isValid: lengthErrors.length === 0,
    messages: createValidationMessages(lengthErrors),
    data: name
  };
};

export const validateUserEmail = (email: string): ValidationResult<string> => {
  const required = validateRequired(email, 'Email');
  if (!required.isValid) return required;

  const errors = validateEmail(email, 'Email');
  return {
    isValid: errors.length === 0,
    messages: createValidationMessages(errors),
    data: email
  };
};

export const validateAuthor = (author: IPost['author']): ValidationResult<IPost['author']> => {
  const nameResult = validateUserName(author.name);
  if (!nameResult.isValid) return {
    isValid: false,
    messages: nameResult.messages,
    data: author
  };

  const emailResult = validateUserEmail(author.email);
  if (!emailResult.isValid) return {
    isValid: false,
    messages: emailResult.messages,
    data: author
  };

  return {
    isValid: true,
    messages: [],
    data: author
  };
}; 