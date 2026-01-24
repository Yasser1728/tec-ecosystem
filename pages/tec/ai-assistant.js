import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BottomNav } from "../../components/layout";
import AssistantChatBox from "../../components/tec/AssistantChatBox";
import { useLanguage } from "../../hooks/useLanguage";

/**
 * AI Assistant Page
 * Chat interface for the TEC AI Assistant (TEC Concierge)
 */
export default function AIAssistant() {
  const { isRTL } = useLanguage();
  const [suggestedPrompts] = useState([
    "What domains are available in TEC?",
    "How do I make payments with Pi?",
    "Tell me about TEC Estate",
    "What subscription tiers are available?",
  ]);
  const [currentTime, setCurrentTime] = useState("");

  // Set time on client side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
  }, []);

  return (
    <>
      <Head>
        <title>TEC AI Assistant | Your Intelligent Guide</title>
        <meta
          name="description"
          content="Chat with the TEC AI Assistant - Your intelligent guide to the TEC ecosystem"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pb-16 md:pb-0" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-2">
                  🤖 TEC AI Assistant
                </h1>
                <p className="text-gray-400">
                  Your intelligent concierge for navigating the TEC ecosystem
                </p>
              </div>
              <Link
                href="/tec"
                className="bg-gray-800 border border-[#00c6ff]/20 text-[#00c6ff] px-4 py-2 rounded-lg font-semibold hover:border-[#00c6ff]/50 transition-all"
              >
                ← Back to Dashboard
              </Link>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-[#00ff9d]/10 to-[#00c6ff]/10 border border-[#00ff9d]/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    About the TEC Assistant
                  </h3>
                  <p className="text-gray-300 text-sm">
                    I'm your AI-powered guide to the TEC ecosystem. Ask me about
                    any of our 24 domains, payment methods, subscription tiers,
                    or how to get started. I'm here to help you discover and
                    navigate all that TEC has to offer!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Chat Area */}
            <div className="lg:col-span-2">
              <div className="h-[600px]">
                <AssistantChatBox suggestions={suggestedPrompts} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-lg border border-[#00ff9d]/20 p-6">
                <h3 className="text-xl font-bold text-[#00ff9d] mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/domains"
                    className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🌐</span>
                      <div>
                        <p className="text-white font-semibold">
                          Explore Domains
                        </p>
                        <p className="text-xs text-gray-400">
                          View all 24 domains
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/upgrade"
                    className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="text-white font-semibold">Upgrade Tier</p>
                        <p className="text-xs text-gray-400">
                          Unlock premium features
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/tec/overview"
                    className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="text-white font-semibold">
                          View Overview
                        </p>
                        <p className="text-xs text-gray-400">
                          Ecosystem insights
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Popular Topics */}
              <div className="bg-gray-800 rounded-lg border border-[#00c6ff]/20 p-6">
                <h3 className="text-xl font-bold text-[#00c6ff] mb-4">
                  Popular Topics
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-gray-300 hover:text-[#00ff9d] transition-colors text-sm">
                    → Getting Started Guide
                  </button>
                  <button className="w-full text-left text-gray-300 hover:text-[#00ff9d] transition-colors text-sm">
                    → Payment Methods
                  </button>
                  <button className="w-full text-left text-gray-300 hover:text-[#00ff9d] transition-colors text-sm">
                    → Domain Categories
                  </button>
                  <button className="w-full text-left text-gray-300 hover:text-[#00ff9d] transition-colors text-sm">
                    → Subscription Benefits
                  </button>
                  <button className="w-full text-left text-gray-300 hover:text-[#00ff9d] transition-colors text-sm">
                    → Security & Privacy
                  </button>
                </div>
              </div>

              {/* Support */}
              <div className="bg-gray-800 rounded-lg border border-[#00ff9d]/20 p-6">
                <h3 className="text-xl font-bold text-[#00ff9d] mb-4">
                  Need Help?
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Can't find what you're looking for? Our support team is here
                  to help.
                </p>
                <button className="w-full bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Contact Support
                </button>
              </div>

              {/* Status */}
              <div className="bg-gray-800 rounded-lg border border-green-500/20 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-white font-semibold">Status: Online</h3>
                </div>
                <p className="text-xs text-gray-400">
                  All systems operational
                  {currentTime && ` • Last updated: ${currentTime}`}
                </p>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300 text-center">
              ℹ️ Currently using mock responses. Full AI integration with
              OpenAI/custom models coming soon.
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}
