export const POST_TYPES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'dog', label: 'Chó' },
  { value: 'cat', label: 'Mèo' },
  { value: 'other', label: 'Khác' }
] as const;

export const POST_STATUS = {
  NEED_HELP: 'need_help',
  HELPING: 'helping',
  HELPED: 'helped',
} as const;

export const URGENCY_LEVELS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'high', label: 'Cao' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'low', label: 'Thấp' }
] as const;

export const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Mới nhất' },
  { value: 'createdAt_asc', label: 'Cũ nhất' },
  { value: 'urgency_desc', label: 'Khẩn cấp nhất' },
  { value: 'urgency_asc', label: 'Ít khẩn cấp nhất' }
] as const;

export const ANIMAL_TYPE = {
  DOG: 'dog',
  CAT: 'cat',
  OTHER: 'other',
} as const;

export const STATUS_COLORS = {
  [POST_STATUS.NEED_HELP]: 'text-red-500',
  [POST_STATUS.HELPING]: 'text-yellow-500',
  [POST_STATUS.HELPED]: 'text-green-500',
} as const;

export const STATUS_TEXT = {
  [POST_STATUS.NEED_HELP]: 'Cần giúp đỡ',
  [POST_STATUS.HELPING]: 'Đang giúp đỡ',
  [POST_STATUS.HELPED]: 'Đã được giúp đỡ',
} as const;

export const ANIMAL_TYPE_TEXT = {
  [ANIMAL_TYPE.DOG]: 'Chó',
  [ANIMAL_TYPE.CAT]: 'Mèo',
  [ANIMAL_TYPE.OTHER]: 'Khác',
} as const;

export const ANIMAL_TYPE_EMOJI = {
  [ANIMAL_TYPE.DOG]: '🐕',
  [ANIMAL_TYPE.CAT]: '🐈',
  [ANIMAL_TYPE.OTHER]: '🐾',
} as const; 