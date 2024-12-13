import type { URLPatternConfig } from './interfaces';

export const URL_PATTERNS: URLPatternConfig = {
  base: {
    http: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
    optional: /^(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
  },
  media: {
    image: /\.(jpg|jpeg|png|gif|webp)$/i,
    video: /\.(mp4|webm|ogg)$/i,
    audio: /\.(mp3|wav|ogg)$/i
  },
  document: {
    pdf: /\.pdf$/i,
    doc: /\.(doc|docx)$/i,
    spreadsheet: /\.(xls|xlsx)$/i
  }
} as const; 