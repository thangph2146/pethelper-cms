import type {
  ValidationLimit,
  ContentValidation,
  UserValidation,
  MediaConfig,
  URLPatternConfig,
  SocialPatternConfig,
  ValidationPatternConfig
} from './interfaces';

export interface ValidationDefaults {
  content: ContentValidation;
  user: UserValidation;
  media: {
    images: MediaConfig;
    videos: MediaConfig;
  };
  interactions: Record<string, ValidationLimit>;
  time: Record<string, number>;
}

export type { 
  URLPatternConfig,
  SocialPatternConfig,
  ValidationPatternConfig
}; 