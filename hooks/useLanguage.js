/**
 * useLanguage Hook
 * TEC Ecosystem - Comprehensive Language Management Hook
 * 
 * Provides:
 * - Language context access
 * - Auto-detection from text
 * - RTL state management
 * - localStorage persistence
 * - Translation helper function
 */

import { useLanguageContext } from '../contexts/LanguageContext';
import { detectLanguage, getResponseLanguage } from '../lib/ai/languageDetection';

/**
 * Translation dictionary
 * Bilingual support for common UI strings
 */
const translations = {
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    
    // Navigation
    home: 'Home',
    domains: 'Domains',
    dashboard: 'Dashboard',
    upgrade: 'Upgrade',
    activity: 'Activity',
    profile: 'Profile',
    
    // AI Assistant
    aiAssistant: 'AI Assistant',
    thinking: 'Thinking...',
    typeMessage: 'Type your message...',
    send: 'Send',
    suggestions: 'Suggestions',
    tryAsking: 'Try asking:',
    
    // Errors
    errorOccurred: 'An error occurred',
    tryAgain: 'Please try again',
    networkError: 'Network error. Please check your connection.',
    
    // Success messages
    messageSent: 'Message sent successfully',
    settingsSaved: 'Settings saved',
    
    // Language
    language: 'Language',
    english: 'English',
    arabic: 'Arabic',
    autoDetect: 'Auto-detect',
    
    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    now: 'Now',
    justNow: 'Just now',
  },
  ar: {
    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    submit: 'إرسال',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    close: 'إغلاق',
    confirm: 'تأكيد',
    
    // Navigation
    home: 'الرئيسية',
    domains: 'النطاقات',
    dashboard: 'لوحة التحكم',
    upgrade: 'ترقية',
    activity: 'النشاط',
    profile: 'الملف الشخصي',
    
    // AI Assistant
    aiAssistant: 'المساعد الذكي',
    thinking: 'جاري التفكير...',
    typeMessage: 'اكتب رسالتك...',
    send: 'إرسال',
    suggestions: 'اقتراحات',
    tryAsking: 'جرب السؤال:',
    
    // Errors
    errorOccurred: 'حدث خطأ',
    tryAgain: 'يرجى المحاولة مرة أخرى',
    networkError: 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
    
    // Success messages
    messageSent: 'تم إرسال الرسالة بنجاح',
    settingsSaved: 'تم حفظ الإعدادات',
    
    // Language
    language: 'اللغة',
    english: 'الإنجليزية',
    arabic: 'العربية',
    autoDetect: 'كشف تلقائي',
    
    // Time
    today: 'اليوم',
    yesterday: 'أمس',
    now: 'الآن',
    justNow: 'الآن',
  }
};

/**
 * useLanguage Hook
 * @returns {Object} - Language utilities and state
 */
export function useLanguage() {
  const context = useLanguageContext();
  
  /**
   * Translation helper function
   * @param {string} key - Translation key
   * @param {Object} options - Optional parameters for dynamic translations
   * @returns {string} - Translated text
   */
  const t = (key, options = {}) => {
    const keys = key.split('.');
    let value = translations[context.language];
    
    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en[key] || key;
        break;
      }
    }
    
    // Replace placeholders if options provided
    if (typeof value === 'string' && options) {
      Object.keys(options).forEach(optKey => {
        value = value.replace(`{{${optKey}}}`, options[optKey]);
      });
    }
    
    return value;
  };
  
  /**
   * Auto-detect language from text
   * @param {string} text - Text to analyze
   * @returns {Object} - Detection result
   */
  const autoDetect = (text) => {
    return detectLanguage(text);
  };
  
  /**
   * Get appropriate response language
   * @param {string} userInput - User input text
   * @returns {string} - Language code
   */
  const getResponseLang = (userInput) => {
    return getResponseLanguage(userInput);
  };
  
  /**
   * Format date according to language
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date
   */
  const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = context.language === 'ar' ? 'ar-SA' : 'en-US';
    
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /**
   * Format time according to language
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted time
   */
  const formatTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = context.language === 'ar' ? 'ar-SA' : 'en-US';
    
    return dateObj.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Format relative time (e.g., "2 hours ago")
   * @param {Date|string} date - Date to format
   * @returns {string} - Relative time string
   */
  const formatRelativeTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now - dateObj;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return t('justNow');
    } else if (diffMins < 60) {
      return context.language === 'ar' 
        ? `منذ ${diffMins} دقيقة`
        : `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return context.language === 'ar'
        ? `منذ ${diffHours} ساعة`
        : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return t('yesterday');
    } else if (diffDays < 7) {
      return context.language === 'ar'
        ? `منذ ${diffDays} أيام`
        : `${diffDays} days ago`;
    } else {
      return formatDate(dateObj);
    }
  };
  
  return {
    ...context,
    t,
    autoDetect,
    getResponseLang,
    formatDate,
    formatTime,
    formatRelativeTime,
    translations: translations[context.language]
  };
}

export default useLanguage;
