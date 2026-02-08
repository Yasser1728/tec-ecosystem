/**
 * Wallet Status Indicator Component
 * TEC Ecosystem - Compact wallet status widget
 * 
 * @module components/payments/WalletStatusIndicator
 * @version 1.0.0
 */

import { useLanguage } from '../../hooks/useLanguage';
import { usePiAuth, PAYMENT_STATUS } from '../../hooks/usePiAuth';
import { translations } from '../../lib/i18n/translations';

/**
 * Wallet Status Indicator Component
 * Compact widget showing wallet connection and network mode
 */
export default function WalletStatusIndicator() {
  const { language, isRTL } = useLanguage();
  const { paymentStatus, user, piAvailable } = usePiAuth();
  
  const t = translations[language].payment;

  /**
   * Get status badge info
   */
  const getBadgeInfo = () => {
    const walletConnected = user && user.uid;

    if (!piAvailable) {
      return {
        icon: '⚠️',
        label: t.offline,
        bgColor: 'bg-gray-800',
        borderColor: 'border-gray-600',
        textColor: 'text-gray-400',
      };
    }

    if (walletConnected) {
      return {
        icon: '✓',
        label: t.walletConnected,
        bgColor: 'bg-green-900/30',
        borderColor: 'border-green-500/50',
        textColor: 'text-green-400',
      };
    }

    return {
      icon: '○',
      label: t.walletDisconnected,
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-600',
      textColor: 'text-gray-400',
    };
  };

  const badgeInfo = getBadgeInfo();

  /**
   * Get network label
   */
  const getNetworkLabel = () => {
    if (!piAvailable) return t.offline;
    if (paymentStatus === PAYMENT_STATUS.MAINNET_READY) return t.networkMainnet;
    if (paymentStatus === PAYMENT_STATUS.TEST_MODE) return t.networkTestnet;
    return t.offline;
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-full
        ${badgeInfo.bgColor} border ${badgeInfo.borderColor}
        transition-all duration-300
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Status Icon */}
      <span className={`text-sm ${badgeInfo.textColor}`}>
        {badgeInfo.icon}
      </span>

      {/* Divider */}
      <span className="text-gray-600">|</span>

      {/* Network Mode */}
      <span className="text-xs text-gray-300">
        {getNetworkLabel()}
      </span>

      {/* Pi API Indicator */}
      {piAvailable && (
        <>
          <span className="text-gray-600">|</span>
          <span className="text-xs text-green-400" title={t.piApiAvailable}>
            Pi ●
          </span>
        </>
      )}
    </div>
  );
}
