import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Alert',
  slug: 'alert',
  title: 'Alert - Monitoring & Notifications',
  description: 'Real-time monitoring and alert systems',
  keywords: ['alerts', 'monitoring', 'notifications', 'real-time'],
  theme: {
    primary: '#F44336',
    secondary: '#1a1a2e',
    accent: '#EF5350'
  },
  routes: [
    { path: '/dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم' },
    { path: '/alerts', label: 'Alerts', labelAr: 'التنبيهات' },
    { path: '/settings', label: 'Settings', labelAr: 'الإعدادات' }
  ],
  i18n: {
    en: {
      title: 'Alert',
      tagline: 'Monitoring & Notifications',
      description: 'Stay informed with real-time alerts'
    },
    ar: {
      title: 'أليرت',
      tagline: 'المراقبة والتنبيهات',
      description: 'ابقَ على اطلاع بالتنبيهات الفورية'
    }
  },
  category: 'tech',
  status: 'active',
  related: ['analytics', 'system', 'dx']
};

export default config;
