import { VALIDATION_CODES } from './validation-codes';
import type { ValidationCode } from './validation-codes';
import type { ValidationMessageParams } from './types/validation-interfaces';
import { createValidationMessage } from './validation-message-builder';

interface ValidationMessageFunctions {
  [VALIDATION_CODES.REQUIRED]: (field: string, params?: never) => string;
  [VALIDATION_CODES.MIN_LENGTH]: (field: string, params: number) => string;
  [VALIDATION_CODES.MAX_LENGTH]: (field: string, max: number) => string;
  [VALIDATION_CODES.PATTERN]: (field: string) => string;
  [VALIDATION_CODES.EMAIL_PATTERN]: (field: string) => string;
  [VALIDATION_CODES.PHONE_PATTERN]: (field: string) => string;
  [VALIDATION_CODES.URL_PATTERN]: (field: string) => string;
  [VALIDATION_CODES.MIN_ARRAY_LENGTH]: (field: string, min: number) => string;
  [VALIDATION_CODES.MAX_ARRAY_LENGTH]: (field: string, max: number) => string;
  [VALIDATION_CODES.INVALID_ARRAY_ITEM]: (field: string, index: number) => string;
  [VALIDATION_CODES.MIN_VALUE]: (field: string, min: number) => string;
  [VALIDATION_CODES.MAX_VALUE]: (field: string, max: number) => string;
  [VALIDATION_CODES.INVALID_DATE]: (field: string) => string;
  [VALIDATION_CODES.MIN_DATE]: (field: string, min: string) => string;
  [VALIDATION_CODES.MAX_DATE]: (field: string, max: string) => string;
  [VALIDATION_CODES.CUSTOM]: (message: string) => string;
}

export const VALIDATION_MESSAGES: ValidationMessageFunctions = {
  [VALIDATION_CODES.REQUIRED]: (field) => 
    createValidationMessage(field)
      .withCode('REQUIRED')
      .build(),

  [VALIDATION_CODES.MIN_LENGTH]: (field, min) => 
    createValidationMessage(field)
      .withCode('MIN_LENGTH')
      .withParams(min)
      .build(),

  [VALIDATION_CODES.MAX_LENGTH]: (field, max) => 
    createValidationMessage(field)
      .withCode('MAX_LENGTH')
      .withParams(max)
      .build(),

  [VALIDATION_CODES.PATTERN]: (field) => 
    createValidationMessage(field)
      .withCode('PATTERN')
      .build(),

  [VALIDATION_CODES.EMAIL_PATTERN]: (field) => 
    createValidationMessage(field)
      .withCode('EMAIL_PATTERN')
      .build(),

  [VALIDATION_CODES.PHONE_PATTERN]: (field) => 
    createValidationMessage(field)
      .withCode('PHONE_PATTERN')
      .build(),

  [VALIDATION_CODES.URL_PATTERN]: (field) => 
    createValidationMessage(field)
      .withCode('URL_PATTERN')
      .build(),

  [VALIDATION_CODES.MIN_ARRAY_LENGTH]: (field, min) => 
    createValidationMessage(field)
      .withCode('MIN_ARRAY_LENGTH')
      .withParams(min)
      .build(),

  [VALIDATION_CODES.MAX_ARRAY_LENGTH]: (field, max) => 
    createValidationMessage(field)
      .withCode('MAX_ARRAY_LENGTH')
      .withParams(max)
      .build(),

  [VALIDATION_CODES.INVALID_ARRAY_ITEM]: (field, index) => 
    createValidationMessage(field)
      .withCode('INVALID_ARRAY_ITEM')
      .withParams(index)
      .build(),

  [VALIDATION_CODES.MIN_VALUE]: (field, min) => 
    createValidationMessage(field)
      .withCode('MIN_VALUE')
      .withParams(min)
      .build(),

  [VALIDATION_CODES.MAX_VALUE]: (field, max) => 
    createValidationMessage(field)
      .withCode('MAX_VALUE')
      .withParams(max)
      .build(),

  [VALIDATION_CODES.INVALID_DATE]: (field) => 
    createValidationMessage(field)
      .withCode('INVALID_DATE')
      .build(),

  [VALIDATION_CODES.MIN_DATE]: (field, min) => 
    createValidationMessage(field)
      .withCode('MIN_DATE')
      .withParams(min)
      .build(),

  [VALIDATION_CODES.MAX_DATE]: (field, max) => 
    createValidationMessage(field)
      .withCode('MAX_DATE')
      .withParams(max)
      .build(),

  [VALIDATION_CODES.CUSTOM]: (message) => message
};

export const getValidationMessage = (
  code: ValidationCode,
  field: string,
  params?: ValidationMessageParams
): string => {
  const messageFn = VALIDATION_MESSAGES[code];
  return messageFn(field, params as any);
}; 