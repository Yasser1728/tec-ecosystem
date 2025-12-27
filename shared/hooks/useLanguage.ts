import { useState, useCallback } from 'react';

type Language = 'en' | 'ar';

interface UseLanguageReturn {
  lang: Language;
  isRTL: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

export const useLanguage = (initialLang: Language = 'en'): UseLanguageReturn => {
  const [lang, setLang] = useState<Language>(initialLang);
  
  const isRTL = lang === 'ar';
  
  const toggleLanguage = useCallback(() => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  }, []);
  
  const setLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
  }, []);
  
  return { lang, isRTL, toggleLanguage, setLanguage };
};
