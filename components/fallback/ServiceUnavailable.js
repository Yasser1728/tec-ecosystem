/**
 * Service Unavailable Component
 * TEC Ecosystem - Generic service unavailable fallback
 * 
 * @module components/fallback/ServiceUnavailable
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n/translations';

/**
 * Service Unavailable Component
 * Shows when a service is temporarily down with auto-retry
 */
export default function ServiceUnavailable({ 
  onRetry, 
  autoRetrySeconds = 30,
  showQuickLinks = true 
}) {
  const { language, isRTL } = useLanguage();
  const [countdown, setCountdown] = useState(autoRetrySeconds);
  
  const t = translations[language].fallback;
  const tCommon = translations[language].common;

  /**
   * Countdown timer for auto-retry
   */
  useEffect(() => {
    if (countdown <= 0 && onRetry) {
      onRetry();
      setCountdown(autoRetrySeconds);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onRetry, autoRetrySeconds]);

  /**
   * Handle manual retry
   */
  const handleRetry = () => {
    setCountdown(autoRetrySeconds);
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center p-8 text-center"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Icon */}
      <div className="text-6xl mb-6">⚠️</div>

      {/* Message */}
      <h2 className="text-2xl font-bold text-white mb-3">
        {t.serviceUnavailable}
      </h2>
      <p className="text-gray-400 mb-8 max-w-md">
        {t.serviceUnavailableDesc}
      </p>

      {/* Retry Button */}
      <button
        onClick={handleRetry}
        className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all mb-4"
      >
        {t.tryAgain}
      </button>

      {/* Auto-retry Countdown */}
      {autoRetrySeconds > 0 && (
        <p className="text-sm text-gray-500">
          {t.autoRetryIn} {countdown} {t.seconds}
        </p>
      )}

      {/* Quick Links */}
      {showQuickLinks && (
        <div className="mt-8 pt-8 border-t border-gray-700 w-full max-w-md">
          <p className="text-sm text-gray-400 mb-4">
            {t.browseOther}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/"
              className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center hover:border-[#00ff9d]/50 transition-colors"
            >
              <div className="text-2xl mb-1">🏠</div>
              <div className="text-xs text-gray-300">{t.goHome}</div>
            </Link>
            
            <Link
              href="/domains"
              className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center hover:border-[#00ff9d]/50 transition-colors"
            >
              <div className="text-2xl mb-1">🌐</div>
              <div className="text-xs text-gray-300">
                {language === 'ar' ? 'النطاقات' : 'Domains'}
              </div>
            </Link>
            
            <Link
              href="/dashboard"
              className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center hover:border-[#00ff9d]/50 transition-colors"
            >
              <div className="text-2xl mb-1">📊</div>
              <div className="text-xs text-gray-300">
                {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
              </div>
            </Link>
            
            <Link
              href="/tec"
              className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center hover:border-[#00ff9d]/50 transition-colors"
            >
              <div className="text-2xl mb-1">ℹ️</div>
              <div className="text-xs text-gray-300">{t.contactSupport}</div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
