/**
 * Layout Component
 * TEC Ecosystem - Main Layout with RTL Support
 * 
 * Features:
 * - Header, Footer, and BottomNav integration
 * - Full RTL/LTR support via Language Context
 * - Mobile-optimized with bottom navigation
 * - Consistent spacing for mobile bottom nav
 */

import Header from './Header';
import Footer from './Footer';
import { BottomNav } from './layout';
import { useLanguage } from '../hooks/useLanguage';

export default function Layout({ children }) {
  const { isRTL } = useLanguage();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
