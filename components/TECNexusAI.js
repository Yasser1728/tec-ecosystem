import { useState } from 'react';

// Fallback translations
const translations = {
  en: {
    title: 'TEC Nexus AI',
    subtitle: 'Your Intelligent Guide to Elite Opportunities',
    placeholder: 'Ask me anything about TEC domains...',
    send: 'Send',
    thinking: 'Thinking...',
    error: 'Something went wrong. Please try again.'
  },
  ar: {
    title: 'TEC Nexus AI',
    subtitle: 'مرشدك الذكي للفرص النخبوية',
    placeholder: 'اسألني أي شيء عن دومينات TEC...',
    send: 'إرسال',
    thinking: 'جاري التفكير...',
    error: 'حدث خطأ. يرجى المحاولة مرة أخرى.'
  }
};

export default function TECNexusAI() {
  const [locale, setLocale] = useState('en');
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[locale];
    for (const k of keys) {
      if (k === 'nexusAI') continue;
      value = value?.[k];
    }
    return value || key;
  };
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/nexus-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          history: messages 
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: t('nexusAI.error')
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: t('nexusAI.error')
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Open TEC Nexus AI"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-gray-900 border border-[#00ff9d]/30 rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00ff9d]/20 to-[#00c6ff]/20 p-4 border-b border-[#00ff9d]/30 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#00ff9d]">{t('nexusAI.title')}</h3>
                <p className="text-xs text-gray-400">{t('nexusAI.subtitle')}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <svg className="w-16 h-16 mx-auto mb-4 text-[#00ff9d]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-sm">{t('nexusAI.placeholder')}</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900'
                      : 'bg-gray-800 text-white border border-[#00ff9d]/20'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white border border-[#00ff9d]/20 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">{t('nexusAI.thinking')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#00ff9d]/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={t('nexusAI.placeholder')}
                className="flex-1 bg-gray-800 text-white border border-[#00ff9d]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00ff9d] transition-colors"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('nexusAI.send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
