/**
 * Enhanced Language Toggle Component
 * TEC Ecosystem - Bilingual Language Switcher
 * 
 * Features:
 * - Animated toggle with gradient background
 * - Auto-detection indicator
 * - Tooltip support
 * - localStorage persistence
 * - Full RTL support
 */

import { useState } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

/**
 * Enhanced Language Toggle Component
 */
export default function LanguageToggle({ showLabel = false, compact = false }) {
  const { language, setLanguage, isRTL, mounted } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }
  
  const handleToggle = (lang) => {
    setLanguage(lang);
    setShowTooltip(false);
  };
  
  return (
    <div className="relative inline-flex items-center gap-2" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Label (optional) */}
      {showLabel && (
        <span className="text-sm text-gray-400 font-medium">
          {language === 'en' ? 'Language' : 'اللغة'}
        </span>
      )}
      
      {/* Toggle Container */}
      <div className="relative">
        {/* Background Track */}
        <div className={`
          relative flex items-center gap-1 p-1
          bg-gray-800/50 backdrop-blur-sm
          border border-gray-700/50
          rounded-full
          transition-all duration-300
          ${compact ? 'min-w-[80px]' : 'min-w-[100px]'}
        `}>
          {/* Sliding Background Indicator */}
          <div className={`
            absolute top-1 ${isRTL ? 'right-1' : 'left-1'}
            ${compact ? 'w-9 h-7' : 'w-11 h-8'}
            bg-gradient-to-r from-tec-green to-tec-blue
            rounded-full
            transition-transform duration-300 ease-out
            shadow-lg
            ${language === 'ar' 
              ? `transform ${isRTL ? '-translate-x-0' : `translate-x-[${compact ? '36px' : '44px'}]`}`
              : 'transform translate-x-0'
            }
          `}
          style={{
            transform: language === 'ar' 
              ? `translateX(${isRTL ? '0' : (compact ? '36px' : '44px')})`
              : 'translateX(0)'
          }}
          />
          
          {/* English Button */}
          <button
            onClick={() => handleToggle('en')}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={`
              relative z-10 flex items-center justify-center
              ${compact ? 'w-9 h-7 text-xs' : 'w-11 h-8 text-sm'}
              font-bold rounded-full
              transition-all duration-300
              ${language === 'en'
                ? 'text-tec-dark scale-110'
                : 'text-gray-400 hover:text-white scale-100'
              }
            `}
            aria-label="Switch to English"
          >
            EN
          </button>
          
          {/* Arabic Button */}
          <button
            onClick={() => handleToggle('ar')}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={`
              relative z-10 flex items-center justify-center
              ${compact ? 'w-9 h-7 text-xs' : 'w-11 h-8 text-sm'}
              font-bold rounded-full
              transition-all duration-300
              ${language === 'ar'
                ? 'text-tec-dark scale-110'
                : 'text-gray-400 hover:text-white scale-100'
              }
            `}
            aria-label="التبديل إلى العربية"
          >
            ع
          </button>
        </div>
        
        {/* Auto-detection Indicator */}
        <div className={`
          absolute -top-1 ${isRTL ? 'left-0' : 'right-0'}
          w-2 h-2 bg-tec-green rounded-full
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          animate-pulse
        `}
        title={language === 'en' ? 'Auto-detection enabled' : 'الكشف التلقائي مفعّل'}
        />
        
        {/* Tooltip */}
        {showTooltip && !compact && (
          <div className={`
            absolute top-full mt-2
            ${isRTL ? 'right-0' : 'left-0'}
            px-3 py-1.5
            bg-gray-900 border border-gray-700
            rounded-lg text-xs text-gray-300
            whitespace-nowrap
            animate-fade-in
            pointer-events-none
          `}>
            {language === 'en' 
              ? 'Language will auto-detect from your messages' 
              : 'ستكتشف اللغة تلقائياً من رسائلك'
            }
            <div className={`
              absolute -top-1
              ${isRTL ? 'right-4' : 'left-4'}
              w-2 h-2 bg-gray-900 border-t border-l border-gray-700
              transform rotate-45
            `} />
          </div>
        )}
      </div>
      
      {/* Current Language Indicator (optional for accessibility) */}
      <span className="sr-only">
        {language === 'en' ? 'Current language: English' : 'اللغة الحالية: العربية'}
      </span>
    </div>
  );
}
