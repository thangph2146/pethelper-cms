import { VALIDATION_CODES } from './validation-codes';
import type { ValidationCode } from './validation-codes';

interface TemplateParams {
  field: string;
  min?: number;
  max?: number;
  value?: string | number;
  index?: number;
  date?: string;
}

type MessageTemplate = (params: TemplateParams) => string;

export const VALIDATION_TEMPLATES: Record<ValidationCode, MessageTemplate> = {
  [VALIDATION_CODES.REQUIRED]: ({ field }) => 
    `${field} là bắt buộc`,

  [VALIDATION_CODES.MIN_LENGTH]: ({ field, min }) => 
    `${field} phải có ít nhất ${min} ký tự`,

  [VALIDATION_CODES.MAX_LENGTH]: ({ field, max }) => 
    `${field} không được vượt quá ${max} ký tự`,

  [VALIDATION_CODES.PATTERN]: ({ field }) => 
    `${field} không hợp lệ`,

  [VALIDATION_CODES.EMAIL_PATTERN]: ({ field }) => 
    `${field} không phải là email hợp lệ`,

  [VALIDATION_CODES.PHONE_PATTERN]: ({ field }) => 
    `${field} không phải là số điện thoại hợp lệ`,

  [VALIDATION_CODES.URL_PATTERN]: ({ field }) => 
    `${field} không phải là URL hợp lệ`,

  [VALIDATION_CODES.MIN_ARRAY_LENGTH]: ({ field, min }) => 
    `${field} phải có ít nhất ${min} phần tử`,

  [VALIDATION_CODES.MAX_ARRAY_LENGTH]: ({ field, max }) => 
    `${field} không được vượt quá ${max} phần tử`,

  [VALIDATION_CODES.INVALID_ARRAY_ITEM]: ({ field, index }) => 
    `${field}[${index}] không hợp lệ`,

  [VALIDATION_CODES.MIN_VALUE]: ({ field, min }) => 
    `${field} phải lớn hơn hoặc bằng ${min}`,

  [VALIDATION_CODES.MAX_VALUE]: ({ field, max }) => 
    `${field} phải nhỏ hơn hoặc bằng ${max}`,

  [VALIDATION_CODES.INVALID_DATE]: ({ field }) => 
    `${field} không phải là ngày hợp lệ`,

  [VALIDATION_CODES.MIN_DATE]: ({ field, date }) => 
    `${field} phải sau ngày ${date}`,

  [VALIDATION_CODES.MAX_DATE]: ({ field, date }) => 
    `${field} phải trước ngày ${date}`,

  [VALIDATION_CODES.CUSTOM]: ({ value }) => 
    value?.toString() || ''
};

export const getMessageFromTemplate = (
  code: ValidationCode,
  params: TemplateParams
): string => {
  const template = VALIDATION_TEMPLATES[code];
  return template(params);
}; 