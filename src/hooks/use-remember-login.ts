import { useState, useEffect } from 'react';

export function useRememberLogin() {
  const [savedEmail, setSavedEmail] = useState<string>('');

  useEffect(() => {
    // Load saved email khi component mount
    const email = localStorage.getItem('savedEmail');
    if (email) {
      setSavedEmail(email);
    }
  }, []);

  const saveLoginInfo = (email: string) => {
    localStorage.setItem('savedEmail', email);
    setSavedEmail(email);
  };

  const clearLoginInfo = () => {
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('rememberMe');
    setSavedEmail('');
  };

  const getSavedEmail = () => {
    return localStorage.getItem('savedEmail') || '';
  };

  return {
    savedEmail,
    saveLoginInfo,
    clearLoginInfo,
    getSavedEmail
  };
} 