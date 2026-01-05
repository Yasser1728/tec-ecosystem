import { useState, useRef, useEffect } from 'react';

/**
 * AssistantChatBox Component
 * Interactive chat interface for the TEC AI Assistant
 */
export default function AssistantChatBox({ onSendMessage, suggestions = [] }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize messages on client side only to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m the TEC Assistant. How can I help you navigate the ecosystem today?',
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the onSendMessage prop or default API
      const response = onSendMessage 
        ? await onSendMessage(input)
        : await fetch('/api/tec/assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input }),
          }).then(res => res.json());

      const assistantMessage = {
        role: 'assistant',
        content: response.content || response.message,
        suggestions: response.suggestions,
        links: response.links,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg border border-[#00ff9d]/20">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900'
                  : 'bg-gray-800 text-gray-100 border border-gray-700'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              
              {/* Links */}
              {msg.links && msg.links.length > 0 && (
                <div className="mt-3 space-y-1">
                  {msg.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      className="block text-[#00c6ff] hover:text-[#00ff9d] text-sm underline"
                    >
                      {link.text} →
                    </a>
                  ))}
                </div>
              )}
              
              {/* Suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              {mounted && (
                <p className="text-xs opacity-50 mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 p-4 rounded-lg border border-gray-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-[#00ff9d] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#00ff9d] rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-[#00ff9d] rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (show when no messages) */}
      {suggestions.length > 0 && messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about TEC..."
            className="flex-1 bg-gray-800 text-gray-100 rounded-lg px-4 py-2 border border-gray-700 focus:border-[#00ff9d] focus:outline-none resize-none"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-6 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
