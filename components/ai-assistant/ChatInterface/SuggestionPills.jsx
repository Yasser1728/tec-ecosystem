/**
 * Suggestion Pills Component
 * TEC Ecosystem - AI Assistant Suggested Prompts
 * 
 * Features:
 * - Staggered animation on load
 * - Hover and tap animations
 * - Bilingual label support
 * - RTL layout support
 */

import { useLanguage } from '../../../hooks/useLanguage';

/**
 * Suggestion Pills Component
 * @param {Object} props - Component props
 * @param {Array<string>} props.suggestions - Suggestion texts
 * @param {Function} props.onSuggestionClick - Click handler
 * @param {string} props.label - Section label (optional)
 */
export default function SuggestionPills({ 
  suggestions = [], 
  onSuggestionClick,
  label = null
}) {
  const { t, isRTL } = useLanguage();
  
  if (!suggestions || suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Label */}
      {label && (
        <p className="text-xs text-gray-500 mb-2 font-medium">
          {label || t('tryAsking')}
        </p>
      )}
      
      {/* Pills Container */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick?.(suggestion)}
            className={`
              group relative
              px-4 py-2 
              text-sm font-medium
              bg-gray-800/50 hover:bg-gray-700/50
              border border-gray-700/50 hover:border-tec-green/50
              rounded-full
              text-gray-300 hover:text-tec-green
              transition-all duration-300
              hover:scale-105 hover:shadow-lg hover:shadow-tec-green/10
              active:scale-95
              animate-fade-in-up
              overflow-hidden
            `}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'backwards'
            }}
          >
            {/* Gradient Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-tec-green/0 via-tec-green/10 to-tec-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Text */}
            <span className="relative z-10">
              {suggestion}
            </span>
            
            {/* Subtle Sparkle Effect on Hover */}
            <div className="absolute top-1 right-2 w-1 h-1 bg-tec-green rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
          </button>
        ))}
      </div>
    </div>
  );
}
