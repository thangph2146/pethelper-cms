export interface URLPatternConfig {
  base: {
    http: RegExp;
    optional: RegExp;
  };
  media: {
    image: RegExp;
    video: RegExp;
    audio: RegExp;
  };
  document: {
    pdf: RegExp;
    doc: RegExp;
    spreadsheet: RegExp;
  };
}

export interface SocialPatternConfig {
  facebook: {
    profile: RegExp;
    page: RegExp;
    group: RegExp;
  };
  twitter: RegExp;
  instagram: RegExp;
}

export interface EmailPatternConfig {
  basic: RegExp;
  strict: RegExp;
  gmail: RegExp;
}

export interface PhonePatternConfig {
  vietnam: {
    mobile: RegExp;
    landline: RegExp;
  };
  international: {
    e164: RegExp;
    basic: RegExp;
  };
}

export interface ValidationPatternConfig {
  url: URLPatternConfig;
  social: SocialPatternConfig;
  email: EmailPatternConfig;
  phone: PhonePatternConfig;
} 