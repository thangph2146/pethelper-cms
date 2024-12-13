export const VALIDATION_PATTERNS = {
  // Email patterns
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Phone patterns
  phone: {
    vietnam: /^(\+84|84|0)[35789][0-9]{8}$/,
    international: /^\+?[1-9]\d{1,14}$/
  },

  // Social media patterns
  social: {
    facebook: /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/[a-zA-Z0-9.]+$/,
    twitter: /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/[a-zA-Z0-9_]+$/,
    instagram: /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9_.]+$/
  },

  // URL patterns
  url: {
    http: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
    optional: /^(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
  }
} as const;

export type ValidationPatterns = typeof VALIDATION_PATTERNS;

export const VALIDATION_DEFAULTS = {
  // Length limits
  length: {
    title: { min: 10, max: 200 },
    content: { min: 20, max: 5000 },
    name: { min: 2, max: 50 }
  },

  // Value limits
  value: {
    likes: { max: 1000000 },
    comments: { max: 100000 },
    saves: { max: 100000 }
  },

  // Array limits
  array: {
    images: { max: 10 },
    tags: { max: 5 }
  }
} as const; 