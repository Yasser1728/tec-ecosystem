/**
 * Typing Indicator Component
 * TEC Ecosystem - AI Assistant Thinking Indicator
 * 
 * Features:
 * - Animated bouncing dots
 * - Bilingual "Thinking..." text
 * - Gradient pulse effect
 * - RTL support
 */

import { useLanguage } from '../../../hooks/useLanguage';

/**
 * Typing Indicator Component
 */
export default function TypingIndicator() {
  const { t, isRTL } = useLanguage();
  
  return (
    <div
      className={`
        flex w-full
        ${isRTL ? 'justify-end' : 'justify-start'}
        animate-fade-in
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className={`
          px-4 py-3 rounded-2xl
          bg-gray-800/80 backdrop-blur-sm
          border border-gray-700/50
          ${isRTL ? 'rounded-bl-sm' : 'rounded-br-sm'}
          shadow-lg
        `}
      >
        <div className="flex items-center gap-3">
          {/* Animated Dots */}
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-tec-green to-tec-blue animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-tec-green to-tec-blue animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-tec-green to-tec-blue animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
          
          {/* Thinking Text */}
          <span className="text-sm text-gray-400 animate-pulse">
            {t('thinking')}
          </span>
        </div>
        
        {/* Subtle Gradient Pulse Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-tec-green/5 to-tec-blue/5 animate-pulse opacity-50" />
      </div>
    </div>
  );
}
