/**
 * Language Context
 * TEC Ecosystem - Bilingual Support Context Provider
 * 
 * Manages global language state with:
 * - Auto-detection from browser
 * - localStorage persistence
 * - RTL state management
 * - Translation helper function
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { getLanguageDirection } from '../lib/ai/languageDetection';

const LanguageContext = createContext();

/**
 * Detect browser language
 * @returns {string} - Language code ('en' or 'ar')
 */
function detectBrowserLanguage() {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language || navigator.userLanguage;
  
  // Check if browser language is Arabic
  if (browserLang.startsWith('ar')) {
    return 'ar';
  }
  
  return 'en';
}

/**
 * Language Context Provider Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.defaultLanguage - Default language (optional)
 */
export function LanguageProvider({ children, defaultLanguage = null }) {
  const [language, setLanguageState] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize language on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    
    // Priority: localStorage > defaultLanguage prop > browser detection
    const storedLanguage = localStorage.getItem('tec-language');
    const initialLanguage = storedLanguage || defaultLanguage || detectBrowserLanguage();
    
    setLanguageState(initialLanguage);
    setIsRTL(getLanguageDirection(initialLanguage) === 'rtl');
    
    // Apply RTL to document
    document.documentElement.dir = getLanguageDirection(initialLanguage);
    document.documentElement.lang = initialLanguage;
  }, [defaultLanguage]);

  /**
   * Set language and persist to localStorage
   * @param {string} newLanguage - Language code ('en' or 'ar')
   */
  const setLanguage = (newLanguage) => {
    setLanguageState(newLanguage);
    setIsRTL(getLanguageDirection(newLanguage) === 'rtl');
    
    // Persist to localStorage
    localStorage.setItem('tec-language', newLanguage);
    
    // Update document attributes
    document.documentElement.dir = getLanguageDirection(newLanguage);
    document.documentElement.lang = newLanguage;
  };

  /**
   * Toggle between English and Arabic
   */
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isRTL,
    mounted
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to use Language Context
 * @returns {Object} - Language context value
 */
export function useLanguageContext() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  
  return context;
}

export default LanguageContext;
