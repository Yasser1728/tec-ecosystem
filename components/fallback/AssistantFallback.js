/**
 * Assistant Fallback Component
 * TEC Ecosystem - Fallback UI when assistant is unavailable
 * 
 * @module components/fallback/AssistantFallback
 * @version 1.0.0
 */

import Link from 'next/link';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n/translations';

/**
 * Assistant Fallback Component
 * Shows FAQ and quick links when assistant API is down
 */
export default function AssistantFallback() {
  const { language, isRTL } = useLanguage();
  
  const t = translations[language].assistant;
  const tCommon = translations[language].common;

  return (
    <div className="p-4 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Unavailable Message */}
      <div className="text-center py-4">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-bold text-white mb-2">
          {t.unavailable}
        </h3>
        <p className="text-sm text-gray-400">
          {t.unavailableDesc}
        </p>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h4 className="font-bold text-white text-sm border-b border-gray-700 pb-2">
          {t.faqTitle}
        </h4>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {t.faq.map((item, idx) => (
            <details
              key={idx}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
            >
              <summary className="px-4 py-3 cursor-pointer hover:bg-gray-750 transition-colors font-medium text-white text-sm">
                {item.q}
              </summary>
              <div className="px-4 py-3 text-sm text-gray-400 border-t border-gray-700">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/domains"
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center hover:border-[#00ff9d]/50 transition-colors"
        >
          <div className="text-2xl mb-1">🌐</div>
          <div className="text-xs text-gray-300">{t.browseDomains}</div>
        </Link>
        
        <Link
          href="/upgrade"
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center hover:border-[#00ff9d]/50 transition-colors"
        >
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-xs text-gray-300">{tCommon.upgrade}</div>
        </Link>
        
        <Link
          href="/dashboard"
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center hover:border-[#00ff9d]/50 transition-colors"
        >
          <div className="text-2xl mb-1">📊</div>
          <div className="text-xs text-gray-300">{tCommon.dashboard}</div>
        </Link>
        
        <Link
          href="/tec"
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center hover:border-[#00ff9d]/50 transition-colors"
        >
          <div className="text-2xl mb-1">ℹ️</div>
          <div className="text-xs text-gray-300">{tCommon.helpCenter}</div>
        </Link>
      </div>

      {/* Retry Button */}
      <button
        onClick={() => window.location.reload()}
        className="w-full bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 rounded-lg py-3 font-semibold text-sm hover:shadow-lg transition-all"
      >
        {t.retry}
      </button>
    </div>
  );
}
