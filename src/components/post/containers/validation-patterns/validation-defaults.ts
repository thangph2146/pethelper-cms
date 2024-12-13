import type { ValidationDefaults } from './types';

export const VALIDATION_DEFAULTS: ValidationDefaults = {
  // Content limits
  content: {
    title: {
      required: true,
      trim: true,
      limit: { min: 10, max: 200 },
      pattern: /^[\p{L}\p{N}\p{P}\p{Z}]+$/u // Allow letters, numbers, punctuation and spaces
    },
    body: {
      required: true,
      trim: true,
      limit: { min: 20, max: 5000 }
    },
    comment: {
      required: true,
      trim: true,
      limit: { min: 1, max: 1000 }
    },
    excerpt: {
      required: false,
      trim: true,
      limit: { min: 10, max: 300 }
    }
  },

  // User input limits
  user: {
    name: {
      required: true,
      trim: true,
      limit: { min: 2, max: 50 },
      pattern: /^[\p{L}\p{N}\s]+$/u // Allow letters, numbers and spaces
    },
    password: {
      required: true,
      trim: false,
      limit: { min: 8, max: 50 },
      strength: {
        minLength: 8,
        requireNumbers: true,
        requireSymbols: true,
        requireUppercase: true
      }
    },
    bio: {
      required: false,
      trim: true,
      limit: { min: 0, max: 500 }
    }
  },

  // Media limits
  media: {
    images: { 
      max: 10,
      maxSize: 5 * 1024 * 1024, // 5MB
      formats: ['jpg', 'jpeg', 'png', 'webp']
    },
    videos: { 
      max: 1,
      maxSize: 100 * 1024 * 1024, // 100MB
      formats: ['mp4', 'webm']
    }
  },

  // Interaction limits
  interactions: {
    likes: { max: 1000000 },
    comments: { max: 100000 },
    saves: { max: 100000 },
    shares: { max: 50000 }
  },

  // Time limits
  time: {
    editWindow: 24 * 60 * 60 * 1000, // 24 hours in ms
    deleteWindow: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  }
} as const; 