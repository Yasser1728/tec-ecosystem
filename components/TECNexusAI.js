import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../hooks/useLanguage";

const translations = {
  en: {
    title: "TEC Assistant",
    subtitle: "Your guide to the ecosystem",
    placeholder: "Ask about TEC domains, payments, tiers...",
    send: "Send",
    thinking: "Thinking...",
    error: "Something went wrong. Please try again.",
    quickPrompts: [
      "What domains are available?",
      "How do Pi payments work?",
      "Tell me about TEC Estate",
      "What tiers are available?",
    ],
  },
  ar: {
    title: "مساعد TEC",
    subtitle: "دليلك للنظام البيئي",
    placeholder: "اسأل عن نطاقات TEC، المدفوعات، المستويات...",
    send: "إرسال",
    thinking: "جاري التفكير...",
    error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    quickPrompts: [
      "ما النطاقات المتاحة؟",
      "كيف تعمل مدفوعات Pi؟",
      "أخبرني عن TEC Estate",
      "ما المستويات المتاحة؟",
    ],
  },
};

export default function TECNexusAI() {
  const { language, isRTL } = useLanguage();
  const t = translations[language] || translations.en;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMessage = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/nexus-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: messages }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.error ? t.error : data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t.error },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 bg-gradient-to-r from-tec-green to-tec-blue text-tec-dark rounded-full shadow-lg hover:shadow-tec-green/30 transition-all duration-300 hover:scale-110 ${
          isOpen ? "bottom-[calc(70vh+1rem)] sm:bottom-[620px] right-4 sm:right-6 p-3" : "bottom-20 md:bottom-6 right-4 sm:right-6 p-4"
        }`}
        aria-label="Toggle TEC Assistant"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 z-50 w-full sm:w-96 h-[70vh] sm:h-[600px] bg-gray-900 border border-gray-700 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col animate-fade-in-up overflow-hidden"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-tec-green/10 to-tec-blue/10 px-5 py-4 border-b border-gray-800 shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-tec-green to-tec-blue flex items-center justify-center">
                  <span className="text-tec-dark font-bold text-sm">AI</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.title}</h3>
                  <p className="text-[11px] text-gray-500">{t.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center pt-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-tec-green/20 to-tec-blue/20 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">{t.placeholder}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {t.quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-gray-300 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-tec-green to-tec-blue text-tec-dark rounded-br-md"
                      : "bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-tec-green rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-tec-green rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-tec-green rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-800 bg-gray-900 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={t.placeholder}
                className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-tec-green/50 transition-colors"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-tec-green to-tec-blue text-tec-dark px-4 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t.send}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
