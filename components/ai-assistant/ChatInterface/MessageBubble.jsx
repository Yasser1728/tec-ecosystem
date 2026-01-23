/**
 * Message Bubble Component
 * TEC Ecosystem - AI Assistant Chat Interface
 * 
 * Features:
 * - Full RTL/LTR alignment support
 * - User/Assistant visual differentiation
 * - Suggestions pills with hover animations
 * - Links section with external link handling
 * - Timestamp formatting per language
 */

import { useLanguage } from '../../../hooks/useLanguage';

/**
 * Message Bubble Component
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object
 * @param {Function} props.onSuggestionClick - Suggestion click handler
 */
export default function MessageBubble({ message, onSuggestionClick }) {
  const { isRTL, formatTime } = useLanguage();
  
  const isUser = message.role === 'user';
  const isError = message.isError;
  
  return (
    <div
      className={`
        flex w-full
        ${isUser ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}
        animate-fade-in-up
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className={`
          max-w-[85%] md:max-w-[75%] lg:max-w-[65%]
          px-4 py-3 rounded-2xl
          ${isUser
            ? `
              bg-gradient-to-r from-tec-green to-tec-blue
              text-tec-dark font-medium
              ${isRTL ? 'rounded-br-sm' : 'rounded-bl-sm'}
            `
            : isError
            ? `
              bg-red-900/20 border border-red-500/30
              text-red-200
              ${isRTL ? 'rounded-bl-sm' : 'rounded-br-sm'}
            `
            : `
              bg-gray-800/80 backdrop-blur-sm
              border border-gray-700/50
              text-gray-100
              ${isRTL ? 'rounded-bl-sm' : 'rounded-br-sm'}
            `
          }
          shadow-lg
          transition-all duration-300
          hover:shadow-xl
        `}
      >
        {/* Message Content */}
        <div className="whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </div>
        
        {/* Links Section */}
        {message.links && message.links.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-2">
            {message.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center gap-2
                  text-sm text-tec-blue hover:text-tec-green
                  transition-colors duration-200
                  group
                `}
              >
                <span className="underline">{link.text}</span>
                <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                  {isRTL ? '←' : '→'}
                </span>
                {link.external !== false && (
                  <span className="text-xs opacity-50">↗</span>
                )}
              </a>
            ))}
          </div>
        )}
        
        {/* Suggestions Pills */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700/50 flex flex-wrap gap-2">
            {message.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className={`
                  px-3 py-1.5 text-xs font-medium
                  bg-gray-700/50 hover:bg-gray-600/50
                  border border-gray-600/50 hover:border-tec-green/50
                  rounded-full
                  text-gray-300 hover:text-tec-green
                  transition-all duration-200
                  hover:scale-105
                  active:scale-95
                `}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        {/* Timestamp */}
        <div
          className={`
            mt-2 text-[10px] opacity-50
            ${isUser ? 'text-tec-dark' : 'text-gray-400'}
          `}
        >
          {formatTime(message.timestamp)}
        </div>
        
        {/* Language Badge (if detected) */}
        {message.detectedLanguage && (
          <div className="mt-1 text-[9px] opacity-30">
            {message.detectedLanguage === 'ar' ? 'العربية' : 'EN'}
          </div>
        )}
      </div>
    </div>
  );
}
