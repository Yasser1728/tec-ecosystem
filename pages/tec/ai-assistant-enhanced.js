/**
 * Enhanced AI Assistant Page
 * TEC Ecosystem - Bilingual AI Chat Interface
 * 
 * Features:
 * - Full bilingual support (English & Arabic)
 * - RTL/LTR automatic switching
 * - Tier-based welcome messages
 * - Language auto-detection
 * - Mobile-first responsive design
 * - Advisory-only AI responses
 */

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { BottomNav, LanguageToggle } from '../../components/layout';
import { MessageBubble, TypingIndicator, InputArea, SuggestionPills } from '../../components/ai-assistant/ChatInterface';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useAIAssistant } from '../../hooks/useAIAssistant';

/**
 * AI Assistant Content Component (with language context)
 */
function AIAssistantContent() {
  const { t, language, isRTL, mounted } = useLanguage();
  const messagesEndRef = useRef(null);
  const [userTier, setUserTier] = useState('free'); // Can be: free, bronze, silver, gold, platinum, diamond
  
  const {
    messages,
    isProcessing,
    sendMessage,
    initializeConversation,
    hasMessages
  } = useAIAssistant({
    apiEndpoint: '/api/tec/assistant',
    onError: (error) => console.error('AI Assistant Error:', error),
    onSuccess: (message) => console.log('Message sent successfully:', message)
  });

  // Initialize conversation on mount
  useEffect(() => {
    if (mounted && !hasMessages) {
      initializeConversation(userTier);
    }
  }, [mounted, hasMessages, userTier, initializeConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Suggested prompts (bilingual)
  const suggestedPrompts = language === 'ar' ? [
    'ما هي النطاقات المتاحة في TEC؟',
    'كيف يمكنني الدفع باستخدام Pi؟',
    'أخبرني عن TEC Estate',
    'ما هي مستويات الاشتراك المتاحة؟',
  ] : [
    'What domains are available in TEC?',
    'How do I make payments with Pi?',
    'Tell me about TEC Estate',
    'What subscription tiers are available?',
  ];

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleSendMessage = async (content) => {
    await sendMessage(content);
  };

  return (
    <>
      <Head>
        <title>{t('aiAssistant')} | TEC Ecosystem</title>
        <meta
          name="description"
          content={language === 'ar' 
            ? 'تحدث مع مساعد TEC الذكي - دليلك الذكي لنظام TEC البيئي'
            : 'Chat with the TEC AI Assistant - Your intelligent guide to the TEC ecosystem'
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-tec-darker via-tec-dark to-tec-darker">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tec-green to-tec-blue mb-2">
                  🤖 {t('aiAssistant')}
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                  {language === 'ar' 
                    ? 'كونسيرجك الذكي للتنقل في نظام TEC البيئي'
                    : 'Your intelligent concierge for navigating the TEC ecosystem'
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Language Toggle */}
                <LanguageToggle compact />
                
                {/* Back Button */}
                <Link
                  href="/tec"
                  className="bg-gray-800 border border-tec-blue/20 text-tec-blue px-4 py-2 rounded-lg font-semibold hover:border-tec-blue/50 transition-all text-sm md:text-base"
                >
                  {language === 'ar' ? '→ العودة للوحة التحكم' : '← Back to Dashboard'}
                </Link>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-tec-green/10 to-tec-blue/10 border border-tec-green/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {language === 'ar' ? 'حول مساعد TEC' : 'About the TEC Assistant'}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {language === 'ar'
                      ? 'أنا دليلك المدعوم بالذكاء الاصطناعي لنظام TEC البيئي. اسألني عن أي من نطاقاتنا الـ 24، أو طرق الدفع، أو مستويات الاشتراك، أو كيفية البدء. أنا هنا لمساعدتك في اكتشاف والتنقل عبر كل ما يقدمه TEC!'
                      : "I'm your AI-powered guide to the TEC ecosystem. Ask me about any of our 24 domains, payment methods, subscription tiers, or how to get started. I'm here to help you discover and navigate all that TEC has to offer!"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Chat Area */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-tec-green/20 shadow-2xl overflow-hidden flex flex-col h-[500px] md:h-[600px]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
                  {messages.map((msg, index) => (
                    <MessageBubble
                      key={index}
                      message={msg}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  ))}
                  
                  {isProcessing && <TypingIndicator />}
                  
                  {/* Suggested Prompts (show when few messages) */}
                  {messages.length <= 1 && !isProcessing && (
                    <div className="pt-4">
                      <SuggestionPills
                        suggestions={suggestedPrompts}
                        onSuggestionClick={handleSuggestionClick}
                        label={t('tryAsking')}
                      />
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <InputArea
                  onSend={handleSendMessage}
                  disabled={isProcessing}
                  maxLength={2000}
                />
              </div>
              
              {/* Advisory Notice */}
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300 text-center">
                  ℹ️ {language === 'ar'
                    ? 'المساعد الذكي استشاري فقط - لا ينفذ المعاملات. جميع الإجراءات تتطلب موافقة صريحة.'
                    : 'AI Assistant is advisory only - does not execute transactions. All actions require explicit approval.'
                  }
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-tec-green/20 p-6">
                <h3 className="text-xl font-bold text-tec-green mb-4">
                  {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/domains"
                    className="block bg-gray-700/50 hover:bg-gray-600/50 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
                      <span className="text-2xl">🌐</span>
                      <div>
                        <p className="text-white font-semibold">
                          {language === 'ar' ? 'استكشف النطاقات' : 'Explore Domains'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {language === 'ar' ? 'عرض جميع النطاقات الـ 24' : 'View all 24 domains'}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/upgrade"
                    className="block bg-gray-700/50 hover:bg-gray-600/50 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="text-white font-semibold">
                          {language === 'ar' ? 'ترقية المستوى' : 'Upgrade Tier'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {language === 'ar' ? 'افتح الميزات المميزة' : 'Unlock premium features'}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/tec/overview"
                    className="block bg-gray-700/50 hover:bg-gray-600/50 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="text-white font-semibold">
                          {language === 'ar' ? 'عرض النظرة العامة' : 'View Overview'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {language === 'ar' ? 'رؤى النظام البيئي' : 'Ecosystem insights'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Popular Topics */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-tec-blue/20 p-6">
                <h3 className="text-xl font-bold text-tec-blue mb-4">
                  {language === 'ar' ? 'مواضيع شائعة' : 'Popular Topics'}
                </h3>
                <div className="space-y-2" dir={isRTL ? 'rtl' : 'ltr'}>
                  {(language === 'ar' ? [
                    'دليل البدء',
                    'طرق الدفع',
                    'فئات النطاقات',
                    'فوائد الاشتراك',
                    'الأمان والخصوصية',
                  ] : [
                    'Getting Started Guide',
                    'Payment Methods',
                    'Domain Categories',
                    'Subscription Benefits',
                    'Security & Privacy',
                  ]).map((topic, index) => (
                    <button
                      key={index}
                      className="w-full text-left text-gray-300 hover:text-tec-green transition-colors text-sm"
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                    >
                      {isRTL ? '← ' : '→ '}{topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-500/20 p-6">
                <div className="flex items-center gap-2 mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-white font-semibold">
                    {language === 'ar' ? 'الحالة: متصل' : 'Status: Online'}
                  </h3>
                </div>
                <p className="text-xs text-gray-400">
                  {language === 'ar' ? 'جميع الأنظمة تعمل' : 'All systems operational'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}

/**
 * Main AI Assistant Page Component (with Language Provider)
 */
export default function AIAssistantPage() {
  return (
    <LanguageProvider>
      <AIAssistantContent />
    </LanguageProvider>
  );
}
