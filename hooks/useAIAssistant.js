/**
 * useAIAssistant Hook
 * TEC Ecosystem - AI Assistant State Management
 * 
 * Provides:
 * - Message state management
 * - Conversation ID tracking
 * - Error handling with bilingual messages
 * - Processing state management
 * - Domain sovereignty enforcement
 */

import { useState, useCallback, useRef } from 'react';
import { useLanguage } from './useLanguage';
import { getResponseLanguage } from '../lib/ai/languageDetection';

/**
 * useAIAssistant Hook
 * @param {Object} options - Configuration options
 * @param {string} options.apiEndpoint - API endpoint for chat (default: /api/tec/assistant)
 * @param {Function} options.onError - Error callback
 * @param {Function} options.onSuccess - Success callback
 * @returns {Object} - AI Assistant utilities and state
 */
export function useAIAssistant(options = {}) {
  const {
    apiEndpoint = '/api/tec/assistant',
    onError = null,
    onSuccess = null
  } = options;
  
  const { language, t, getResponseLang } = useLanguage();
  
  // State
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  
  // Refs
  const abortControllerRef = useRef(null);
  
  /**
   * Initialize conversation with welcome message
   */
  const initializeConversation = useCallback((tier = 'free') => {
    const welcomeMessages = {
      en: {
        free: "Hello! I'm your TEC Assistant. How may I help you navigate the ecosystem today?",
        bronze: "Welcome, Bronze Member! I'm your dedicated TEC Concierge. How may I assist you today?",
        silver: "Greetings, Silver Elite! Your TEC Concierge is at your service. How may I assist you?",
        gold: "Welcome, Gold Patron! Your personal TEC Concierge awaits your command. How may I serve you today?",
        platinum: "Distinguished Platinum Member, your exclusive TEC Concierge is honored to serve. How may I be of assistance?",
        diamond: "Esteemed Diamond Elite, your private TEC Concierge is at your exclusive service. What may I arrange for you today?"
      },
      ar: {
        free: "مرحباً! أنا مساعد TEC الخاص بك. كيف يمكنني مساعدتك في التنقل عبر النظام البيئي اليوم؟",
        bronze: "مرحباً بك، عضو برونزي! أنا كونسيرج TEC المخصص لك. كيف يمكنني مساعدتك اليوم؟",
        silver: "تحياتي، نخبة فضية! كونسيرج TEC في خدمتك. كيف يمكنني المساعدة؟",
        gold: "مرحباً بك، راعي ذهبي! كونسيرج TEC الشخصي ينتظر أوامرك. كيف يمكنني خدمتك اليوم؟",
        platinum: "عضو بلاتيني متميز، كونسيرج TEC الحصري يشرفه أن يخدمك. كيف يمكنني المساعدة؟",
        diamond: "نخبة الماس الموقرة، كونسيرج TEC الخاص في خدمتك الحصرية. ماذا يمكنني أن أرتب لك اليوم؟"
      }
    };
    
    const welcomeMessage = {
      role: 'assistant',
      content: welcomeMessages[language][tier] || welcomeMessages[language].free,
      timestamp: new Date().toISOString(),
      tier
    };
    
    setMessages([welcomeMessage]);
    
    // Generate conversation ID
    const newConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setConversationId(newConversationId);
    
    return newConversationId;
  }, [language]);
  
  /**
   * Send message to AI Assistant
   * @param {string} content - Message content
   * @param {Object} metadata - Optional metadata
   * @returns {Promise<Object>} - Response message
   */
  const sendMessage = useCallback(async (content, metadata = {}) => {
    if (!content || !content.trim()) {
      const errorMsg = {
        en: 'Please enter a message',
        ar: 'الرجاء إدخال رسالة'
      };
      setError(errorMsg[language]);
      return null;
    }
    
    // Clear previous error
    setError(null);
    
    // Detect language from user input
    const detectedLanguage = getResponseLang(content);
    
    // Add user message
    const userMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      detectedLanguage,
      ...metadata
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationId,
          language: detectedLanguage,
          metadata
        }),
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Create assistant message
      const assistantMessage = {
        role: 'assistant',
        content: data.content || data.message,
        timestamp: new Date().toISOString(),
        suggestions: data.suggestions || [],
        links: data.links || [],
        language: detectedLanguage,
        ...data
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Success callback
      if (onSuccess) {
        onSuccess(assistantMessage);
      }
      
      return assistantMessage;
      
    } catch (err) {
      // Handle abort
      if (err.name === 'AbortError') {
        console.log('Request was cancelled');
        return null;
      }
      
      console.error('Error sending message:', err);
      
      // Bilingual error messages
      const errorMessages = {
        en: {
          network: 'Network error. Please check your connection and try again.',
          server: 'Server error. Our team has been notified. Please try again later.',
          default: 'An error occurred. Please try again.'
        },
        ar: {
          network: 'خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
          server: 'خطأ في الخادم. تم إبلاغ فريقنا. يرجى المحاولة لاحقاً.',
          default: 'حدث خطأ. يرجى المحاولة مرة أخرى.'
        }
      };
      
      const errorType = err.message.includes('fetch') || err.message.includes('network')
        ? 'network'
        : err.message.includes('500') || err.message.includes('502')
        ? 'server'
        : 'default';
      
      const errorContent = errorMessages[language][errorType];
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setError(errorContent);
      
      // Error callback
      if (onError) {
        onError(err);
      }
      
      return null;
      
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  }, [conversationId, language, apiEndpoint, getResponseLang, onError, onSuccess]);
  
  /**
   * Cancel current request
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsProcessing(false);
    }
  }, []);
  
  /**
   * Clear conversation
   */
  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    setConversationId(null);
  }, []);
  
  /**
   * Reset conversation with new welcome message
   */
  const resetConversation = useCallback((tier = 'free') => {
    clearConversation();
    return initializeConversation(tier);
  }, [clearConversation, initializeConversation]);
  
  /**
   * Get conversation summary
   */
  const getConversationSummary = useCallback(() => {
    return {
      conversationId,
      messageCount: messages.length,
      userMessageCount: messages.filter(m => m.role === 'user').length,
      assistantMessageCount: messages.filter(m => m.role === 'assistant').length,
      hasError: !!error,
      startTime: messages[0]?.timestamp,
      lastMessageTime: messages[messages.length - 1]?.timestamp
    };
  }, [conversationId, messages, error]);
  
  return {
    // State
    messages,
    isProcessing,
    error,
    conversationId,
    
    // Actions
    sendMessage,
    cancelRequest,
    clearConversation,
    resetConversation,
    initializeConversation,
    
    // Utilities
    getConversationSummary,
    
    // Computed
    hasMessages: messages.length > 0,
    canSendMessage: !isProcessing
  };
}

export default useAIAssistant;
