import type { SocialPlatform } from './validation/social-validation';

export const VALIDATION_ERRORS = {
  // Field errors
  field: {
    minValue: (field: string, min: number) => `${field} phải lớn hơn ${min}`,
    maxValue: (field: string, max: number) => `${field} không được vượt quá ${max}`,
    required: (field: string) => `${field} là bắt buộc`,
    minLength: (field: string, min: number) => `${field} phải có ít nhất ${min} ký tự`,
    maxLength: (field: string, max: number) => `${field} không được vượt quá ${max} ký tự`,
    invalidValue: (field: string) => `${field} không hợp lệ`,
    invalidDate: (field: string) => `${field} không phải là ngày hợp lệ`,
    minDate: (field: string, min: Date) => `${field} phải sau ngày ${min.toLocaleDateString()}`,
    maxDate: (field: string, max: Date) => `${field} phải trước ngày ${max.toLocaleDateString()}`,
    invalidUrl: (field: string) => `${field} không phải là URL hợp lệ`,
    invalidProtocol: (field: string, protocols: string[]) => 
      `${field} phải sử dụng một trong các giao thức: ${protocols.join(', ')}`,
    invalidEmail: (field: string) => `${field} không phải là email hợp lệ`,
    invalidPhone: (field: string) => `${field} không phải là số điện thoại hợp lệ`,
    invalidSocialMedia: (field: string, platform: SocialPlatform) => 
      `${field} không phải là địa chỉ ${platform} hợp lệ`
  },

  // Limit errors
  limit: {
    maxCount: (field: string, max: number) => `Tối đa ${max} ${field} được phép`,
    maxValue: (field: string, max: number) => `${field} không được vượt quá ${max}`
  },

  // Status errors
  status: {
    invalid: 'Trạng thái không hợp lệ',
    invalidTransition: (from: string, to: string) => `Không thể chuyển từ trạng thái ${from} sang ${to}`
  }
} as const; 