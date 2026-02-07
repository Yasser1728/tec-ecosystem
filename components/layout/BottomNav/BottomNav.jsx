/**
 * Bottom Navigation Component
 * TEC Ecosystem - Mobile Navigation
 * 
 * Features:
 * - 5 navigation items: Home, Domains, AI (elevated), Activity, Profile
 * - Full RTL/LTR support
 * - Safe area inset handling for iOS
 * - Active state indicators with animations
 * - Elevated AI button with gradient
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../../../hooks/useLanguage';

/**
 * Navigation items configuration
 */
const getNavItems = (t) => [
  {
    id: 'home',
    label: t('home'),
    icon: '🏠',
    href: '/',
    gradient: false
  },
  {
    id: 'domains',
    label: t('domains'),
    icon: '🌐',
    href: '/domains',
    gradient: false
  },
  {
    id: 'ai',
    label: t('aiAssistant'),
    icon: '🤖',
    href: '/tec/ai-assistant',
    gradient: true,
    elevated: true
  },
  {
    id: 'dashboard',
    label: t('dashboard'),
    icon: '📊',
    href: '/tec/dashboard',
    gradient: false
  },
  {
    id: 'upgrade',
    label: t('upgrade'),
    icon: '⭐',
    href: '/upgrade',
    gradient: false
  }
];

/**
 * Bottom Navigation Component
 */
export default function BottomNav() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  
  const navItems = getNavItems(t);
  
  /**
   * Check if route is active
   */
  const isActive = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };
  
  return (
    <>
      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-tec-darker/95 backdrop-blur-lg border-t border-tec-green/20"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex items-end justify-around h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  relative flex flex-col items-center justify-center
                  transition-all duration-300 ease-out
                  ${item.elevated ? '-mt-6' : 'flex-1'}
                  ${active && !item.elevated ? 'scale-110' : ''}
                `}
              >
                {/* Elevated AI Button */}
                {item.elevated ? (
                  <div className="relative">
                    {/* Gradient Glow */}
                    <div className={`
                      absolute inset-0 rounded-full
                      bg-gradient-to-r from-tec-green to-tec-blue
                      ${active ? 'opacity-100 blur-xl' : 'opacity-50 blur-lg'}
                      transition-all duration-300
                    `} />
                    
                    {/* Button */}
                    <div className={`
                      relative w-16 h-16 rounded-full
                      flex items-center justify-center
                      bg-gradient-to-r from-tec-green to-tec-blue
                      transform transition-all duration-300
                      ${active ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}
                      hover:scale-110 hover:rotate-6
                      shadow-lg
                    `}>
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    
                    {/* Label */}
                    <span className={`
                      absolute -bottom-5 left-1/2 transform -translate-x-1/2
                      text-[10px] font-semibold whitespace-nowrap
                      ${active ? 'text-tec-green' : 'text-gray-400'}
                      transition-colors duration-300
                    `}>
                      {item.label}
                    </span>
                  </div>
                ) : (
                  /* Regular Navigation Items */
                  <div className="relative flex flex-col items-center justify-center w-full h-full">
                    {/* Icon */}
                    <span className={`
                      text-xl mb-0.5
                      transition-all duration-300
                      ${active ? 'scale-110' : 'scale-100'}
                    `}>
                      {item.icon}
                    </span>
                    
                    {/* Label */}
                    <span className={`
                      text-[10px] font-medium
                      ${active ? 'text-tec-green' : 'text-gray-400'}
                      transition-colors duration-300
                    `}>
                      {item.label}
                    </span>
                    
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2">
                        <div className="w-1 h-1 rounded-full bg-tec-green animate-pulse" />
                      </div>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Spacer for bottom nav on mobile */}
      <div className="h-16 md:hidden" style={{ height: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }} />
    </>
  );
}
