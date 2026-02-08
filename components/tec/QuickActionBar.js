/**
 * Quick Action Bar Component
 * TEC Ecosystem - Quick action buttons for TEC Assistant
 * 
 * @module components/tec/QuickActionBar
 * @version 1.0.0
 */

import { useRouter } from 'next/router';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../lib/i18n/translations';

/**
 * Quick Action Bar Component
 * Row of quick action buttons inside the assistant
 */
export default function QuickActionBar({ onActionClick }) {
  const router = useRouter();
  const { language, isRTL } = useLanguage();
  
  const t = translations[language].assistant;

  /**
   * Quick actions configuration
   */
  const actions = [
    {
      id: 'browse-domains',
      label: t.browseDomains,
      icon: '🌐',
      route: '/domains',
    },
    {
      id: 'check-wallet',
      label: t.checkWallet,
      icon: '💳',
      route: '/dashboard',
    },
    {
      id: 'pay-pi',
      label: t.payWithPi,
      icon: '💰',
      route: '/upgrade',
    },
    {
      id: 'get-help',
      label: t.getHelp,
      icon: 'ℹ️',
      route: '/tec',
    },
  ];

  /**
   * Handle action button click
   */
  const handleAction = (action) => {
    if (onActionClick) {
      onActionClick(action);
    }
    
    if (action.route) {
      router.push(action.route);
    }
  };

  return (
    <div
      className="border-t border-gray-700 bg-gray-850 p-3"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <p className="text-xs text-gray-400 mb-2 px-1">
        {t.quickActions}
      </p>
      
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            className="
              flex items-center gap-2 px-3 py-2 rounded-lg
              bg-gray-800 border border-gray-700
              hover:border-[#00ff9d]/50 hover:bg-gray-750
              transition-all duration-200
              text-left
            "
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-xs text-gray-300 font-medium">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
