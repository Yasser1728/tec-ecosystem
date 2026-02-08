/**
 * Payment Readiness Bar Component
 * TEC Ecosystem - Payment system status indicator
 * 
 * @module components/payments/PaymentReadinessBar
 * @version 1.0.0
 */

import { useLanguage } from '../../hooks/useLanguage';
import { usePiAuth, PAYMENT_STATUS } from '../../hooks/usePiAuth';
import { translations } from '../../lib/i18n/translations';

/**
 * Payment Readiness Bar Component
 * Shows payment system readiness and network status
 */
export default function PaymentReadinessBar() {
  const { language, isRTL } = useLanguage();
  const { paymentStatus, user, piAvailable } = usePiAuth();
  
  const t = translations[language].payment;

  /**
   * Get status info based on payment status
   */
  const getStatusInfo = () => {
    if (!piAvailable) {
      return {
        icon: '🔴',
        label: t.offline,
        description: t.offlineDesc,
        bgColor: 'bg-red-900/20',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-400',
      };
    }

    if (paymentStatus === PAYMENT_STATUS.MAINNET_READY) {
      return {
        icon: '🟢',
        label: t.ready,
        description: t.readyDesc,
        bgColor: 'bg-green-900/20',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-400',
      };
    }

    if (paymentStatus === PAYMENT_STATUS.TEST_MODE) {
      return {
        icon: '🟡',
        label: t.sandbox,
        description: t.sandboxDesc,
        bgColor: 'bg-yellow-900/20',
        borderColor: 'border-yellow-500/30',
        textColor: 'text-yellow-400',
      };
    }

    return {
      icon: '🔴',
      label: t.offline,
      description: t.offlineDesc,
      bgColor: 'bg-gray-900/20',
      borderColor: 'border-gray-500/30',
      textColor: 'text-gray-400',
    };
  };

  const statusInfo = getStatusInfo();

  /**
   * Get wallet status
   */
  const walletConnected = user && user.uid;

  return (
    <div
      className={`
        w-full border-b ${statusInfo.borderColor} ${statusInfo.bgColor}
        backdrop-blur-sm py-3 px-4
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Main Status */}
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">
            {statusInfo.icon}
          </span>
          <div>
            <h3 className={`font-semibold ${statusInfo.textColor} text-sm`}>
              {statusInfo.label}
            </h3>
            <p className="text-xs text-gray-400">
              {statusInfo.description}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center gap-6 text-sm">
          {/* Wallet Status */}
          <div className="flex items-center gap-2">
            <span className={walletConnected ? 'text-green-400' : 'text-gray-400'}>
              {walletConnected ? '✓' : '✗'}
            </span>
            <span className="text-gray-300">
              {walletConnected ? t.walletConnected : t.walletDisconnected}
            </span>
          </div>

          {/* Network Mode */}
          {piAvailable && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-gray-400">●</span>
              <span className="text-gray-300">
                {paymentStatus === PAYMENT_STATUS.MAINNET_READY 
                  ? t.networkMainnet 
                  : t.networkTestnet}
              </span>
            </div>
          )}

          {/* Pi API Status */}
          {piAvailable && (
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-green-400">●</span>
              <span className="text-gray-300">
                {t.piApiAvailable}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
