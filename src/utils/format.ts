export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatPhoneNumber(phone: string): string {
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

export const STATUS_COLORS = {
  'need-help': 'bg-red-100 text-red-800',
  'being-helped': 'bg-yellow-100 text-yellow-800',
  'helped': 'bg-green-100 text-green-800'
};

export const CATEGORY_LABELS = {
  'dog': 'Chó',
  'cat': 'Mèo',
  'other': 'Khác'
}; 