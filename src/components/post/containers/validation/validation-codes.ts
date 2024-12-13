export const VALIDATION_CODES = {
  // Required validation
  REQUIRED: 'REQUIRED',

  // Length validation
  MIN_LENGTH: 'MIN_LENGTH',
  MAX_LENGTH: 'MAX_LENGTH',
  
  // Pattern validation
  PATTERN: 'PATTERN',
  EMAIL_PATTERN: 'EMAIL_PATTERN',
  PHONE_PATTERN: 'PHONE_PATTERN',
  URL_PATTERN: 'URL_PATTERN',
  
  // Array validation
  MIN_ARRAY_LENGTH: 'MIN_ARRAY_LENGTH',
  MAX_ARRAY_LENGTH: 'MAX_ARRAY_LENGTH',
  INVALID_ARRAY_ITEM: 'INVALID_ARRAY_ITEM',
  
  // Number validation
  MIN_VALUE: 'MIN_VALUE',
  MAX_VALUE: 'MAX_VALUE',
  
  // Date validation
  INVALID_DATE: 'INVALID_DATE',
  MIN_DATE: 'MIN_DATE',
  MAX_DATE: 'MAX_DATE',
  
  // Custom validation
  CUSTOM: 'CUSTOM'
} as const;

export type ValidationCode = keyof typeof VALIDATION_CODES; 