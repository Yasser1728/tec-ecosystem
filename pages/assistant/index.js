/**
 * TEC Assistant - Landing Page
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function TECAssistant() {
  const [todaySignal, setTodaySignal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaySignal();
  }, []);

  const fetchTodaySignal = async () => {
    try {
      const response = await fetch('/api/v1/tec-assistant/signals/today');
      const data = await response.json();
      if (data.success) {
        setTodaySignal(data.data.signal);
      }
    } catch (error) {
      console.error('Failed to fetch signal:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSignalColor = (type) => {
    switch (type) {
      case 'POSITIVE':
        return 'bg-green-500';
      case 'NEUTRAL':
        return 'bg-blue-500';
      case 'CAUTION':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <Head>
        <title>TEC Assistant - Your Daily AI Guide</title>
        <meta name="description" content="TEC Assistant provides daily signals and gamification powered by Pi Network" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-white mb-4">
              🎯 TEC Assistant
            </h1>
            <p className="text-2xl text-purple-200 mb-8">
              Your Daily AI-Powered Guide
            </p>
            <p className="text-lg text-purple-300 max-w-2xl mx-auto">
              Get personalized daily signals, build your streak, earn XP, and unlock premium features with Pi Network
            </p>
          </div>

          {/* Today's Signal Card */}
          {!loading && todaySignal && (
            <div className="max-w-3xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                  Today&apos;s Signal
                </h2>
                <div className="flex flex-col items-center">
                  <div className={`w-32 h-32 rounded-full ${getSignalColor(todaySignal.type)} flex items-center justify-center text-6xl mb-4`}>
                    {todaySignal.emoji}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {todaySignal.type}
                  </h3>
                  <p className="text-xl text-purple-200 text-center">
                    {todaySignal.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">Daily Signals</h3>
              <p className="text-purple-200">
                Get AI-generated daily guidance to navigate your decisions
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-white mb-2">Streak & XP</h3>
              <p className="text-purple-200">
                Build your daily check-in streak and level up with XP rewards
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-white mb-2">Pi Payments</h3>
              <p className="text-purple-200">
                Unlock premium features using Pi cryptocurrency
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105 shadow-2xl">
              Login with Pi Network
            </button>
            <p className="text-purple-300 mt-4">
              Connect your Pi wallet to get started
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="container mx-auto px-4 text-center text-purple-300">
            <p>TEC Assistant - Part of the TEC Ecosystem</p>
            <p className="text-sm mt-2">Powered by Pi Network & Clean Architecture</p>
          </div>
        </footer>
      </div>
    </>
  );
}
