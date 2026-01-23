/**
 * Input Area Component
 * TEC Ecosystem - AI Assistant Message Input
 * 
 * Features:
 * - Voice input button support placeholder
 * - Character count indicator
 * - RTL text input support
 * - Disabled state during processing
 * - Send on Enter (Shift+Enter for new line)
 * - Auto-resize textarea
 */

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

/**
 * Input Area Component
 * @param {Object} props - Component props
 * @param {Function} props.onSend - Send message handler
 * @param {boolean} props.disabled - Disable input
 * @param {number} props.maxLength - Maximum character length
 */
export default function InputArea({ 
  onSend, 
  disabled = false,
  maxLength = 2000
}) {
  const { t, isRTL } = useLanguage();
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  /**
   * Handle send message
   */
  const handleSend = () => {
    if (!input.trim() || disabled) return;
    
    onSend(input);
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  /**
   * Handle key press (Enter to send, Shift+Enter for new line)
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInput(value);
    }
  };
  
  const characterCount = input.length;
  const isNearLimit = characterCount > maxLength * 0.9;
  const canSend = input.trim().length > 0 && !disabled;
  
  return (
    <div
      className={`
        border-t border-gray-800/50 backdrop-blur-sm
        bg-gray-900/50
        p-4
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        {/* Voice Input Button (Placeholder) */}
        <button
          type="button"
          disabled={disabled}
          className={`
            flex-shrink-0 w-10 h-10 rounded-full
            flex items-center justify-center
            bg-gray-800 hover:bg-gray-700
            border border-gray-700
            text-gray-400 hover:text-tec-green
            transition-all duration-200
            disabled:opacity-30 disabled:cursor-not-allowed
          `}
          title={t('voiceInput')}
          aria-label={t('voiceInput')}
        >
          🎤
        </button>
        
        {/* Input Container */}
        <div className="flex-1 relative">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t('typeMessage')}
            disabled={disabled}
            rows={1}
            className={`
              w-full px-4 py-3
              bg-gray-800 text-gray-100 placeholder-gray-500
              border-2 rounded-2xl
              resize-none
              transition-all duration-200
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isFocused 
                ? 'border-tec-green/50 shadow-lg shadow-tec-green/10' 
                : 'border-gray-700'
              }
              ${isRTL ? 'text-right' : 'text-left'}
            `}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              direction: isRTL ? 'rtl' : 'ltr'
            }}
          />
          
          {/* Character Count */}
          {characterCount > 0 && (
            <div
              className={`
                absolute ${isRTL ? 'left-3' : 'right-3'} bottom-2
                text-[10px] font-medium
                ${isNearLimit ? 'text-red-400' : 'text-gray-500'}
                transition-colors duration-200
              `}
            >
              {characterCount} / {maxLength}
            </div>
          )}
          
          {/* Hint Text */}
          {!input && !isFocused && (
            <div className={`
              absolute ${isRTL ? 'right-4' : 'left-4'} bottom-0.5
              text-[10px] text-gray-600
              pointer-events-none
            `}>
              {isRTL ? 'Shift+Enter للسطر الجديد' : 'Shift+Enter for new line'}
            </div>
          )}
        </div>
        
        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={`
            flex-shrink-0 w-10 h-10 rounded-full
            flex items-center justify-center
            font-semibold
            transition-all duration-200
            disabled:opacity-30 disabled:cursor-not-allowed
            ${canSend
              ? `
                bg-gradient-to-r from-tec-green to-tec-blue
                text-tec-dark
                hover:scale-110 hover:shadow-lg hover:shadow-tec-green/30
                active:scale-95
              `
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }
          `}
          title={t('send')}
          aria-label={t('send')}
        >
          <span className={`text-xl ${isRTL ? 'rotate-180' : ''}`}>
            ➤
          </span>
        </button>
      </div>
      
      {/* Processing Indicator */}
      {disabled && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">
            {t('thinking')}
          </span>
        </div>
      )}
    </div>
  );
}
