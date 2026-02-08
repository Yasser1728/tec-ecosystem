/**
 * Assistant Floating Widget Component
 * TEC Ecosystem - Global floating AI assistant chat bubble
 * 
 * @module components/tec/AssistantFloatingWidget
 * @version 1.0.0
 */

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n/translations';
import QuickActionBar from './QuickActionBar';
import AssistantFallback from '../fallback/AssistantFallback';

/**
 * Assistant Floating Widget Component
 * Floating chat bubble that appears on all pages
 */
export default function AssistantFloatingWidget() {
  const { language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const messagesEndRef = useRef(null);
  
  const t = translations[language].assistant;
  const tCommon = translations[language].common;

  /**
   * Scroll to bottom of messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Initialize welcome message when opened
   */
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        text: language === 'ar'
          ? 'مرحباً! أنا مساعد TEC. كيف يمكنني مساعدتك اليوم؟'
          : 'Hello! I\'m the TEC Assistant. How can I help you today?',
        sender: 'assistant',
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length, language]);

  /**
   * Handle sending a message
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsError(false);

    try {
      // Call the assistant API
      const response = await fetch('/api/tec/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      const assistantMessage = {
        id: Date.now() + 1,
        text: data.response || data.message || 'Sorry, I couldn\'t process that.',
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Assistant API error:', error);
      setIsError(true);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: t.error,
        sender: 'assistant',
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle key press (Enter to send)
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Toggle widget open/closed
   */
  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-80 max-w-[90vw] h-[500px] max-h-[80vh] bg-gray-900 border border-[#00ff9d]/30 rounded-lg shadow-2xl shadow-[#00ff9d]/10 flex flex-col overflow-hidden"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-bold text-gray-900">{t.title}</h3>
                <p className="text-xs text-gray-800">{t.subtitle}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* Minimize Button */}
              <button
                onClick={toggleWidget}
                className="text-gray-900 hover:text-gray-700 transition-colors"
                title={t.minimize}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Show fallback if error persists */}
          {isError ? (
            <div className="flex-1 overflow-y-auto">
              <AssistantFallback />
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[80%] p-3 rounded-lg text-sm
                        ${msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900'
                          : msg.isError
                            ? 'bg-red-900/30 border border-red-500/50 text-red-300'
                            : 'bg-gray-800 text-gray-300'
                        }
                      `}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-gray-300 p-3 rounded-lg text-sm">
                      {t.typing}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <QuickActionBar onActionClick={() => {}} />

              {/* Input Area */}
              <div className="border-t border-gray-700 p-3 bg-gray-850">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.placeholder}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff9d]/50"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 rounded-lg px-4 py-2 font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.send}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleWidget}
        className={`
          fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-r from-[#00ff9d] to-[#00c6ff]
          flex items-center justify-center
          shadow-lg hover:shadow-xl hover:shadow-[#00ff9d]/30
          transition-all duration-300
          ${isOpen ? 'scale-0' : 'scale-100'}
        `}
        aria-label={t.title}
      >
        <span className="text-2xl">🤖</span>
      </button>
    </>
  );
}
