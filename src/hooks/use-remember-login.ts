'use client';

export const getSavedEmail = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('savedEmail') || '';
};

export const saveEmail = (email: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('savedEmail', email);
};

export const clearSavedEmail = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('savedEmail');
};

export const setRememberMe = (value: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('rememberMe', value ? 'true' : 'false');
};

export const getRememberMe = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('rememberMe') === 'true';
}; 