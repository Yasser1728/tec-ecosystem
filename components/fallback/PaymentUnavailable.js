/**
 * Payment Unavailable Component
 * TEC Ecosystem - Payment system unavailable fallback
 * 
 * @module components/fallback/PaymentUnavailable
 * @version 1.0.0
 */

import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n/translations';

/**
 * Payment Unavailable Component
 * Shows when Pi payment system is unavailable
 */
export default function PaymentUnavailable({ 
  estimatedReturnTime,
  showAlternatives = true 
}) {
  const { language, isRTL } = useLanguage();
  
  const t = translations[language].payment;
  const tCommon = translations[language].common;

  return (
    <div 
      className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Icon */}
      <div className="text-5xl mb-4">💳</div>

      {/* Message */}
      <h3 className="text-xl font-bold text-white mb-2">
        {t.unavailable}
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        {t.unavailableDesc}
      </p>

      {/* Estimated Return Time */}
      {estimatedReturnTime && (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 mb-1">
            {t.estimatedReturn}
          </p>
          <p className="text-sm font-semibold text-gray-300">
            {estimatedReturnTime}
          </p>
        </div>
      )}

      {/* Check Back Soon */}
      <p className="text-sm text-gray-500 mb-4">
        {t.checkBackSoon}
      </p>

      {/* Status Indicators */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-red-400">●</span>
          <span className="text-xs text-gray-400">Pi SDK</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-400">●</span>
          <span className="text-xs text-gray-400">
            {language === 'ar' ? 'شبكة Pi' : 'Pi Network'}
          </span>
        </div>
      </div>

      {/* Alternative Payment Methods */}
      {showAlternatives && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 mb-3">
            {t.useAlternative}
          </p>
          <div className="text-xs text-gray-600">
            {language === 'ar'
              ? 'سيتم إضافة طرق دفع بديلة قريباً'
              : 'Alternative payment methods coming soon'}
          </div>
        </div>
      )}
    </div>
  );
}
