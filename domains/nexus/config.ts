import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Nexus',
  slug: 'nexus',
  title: 'Nexus - Integration Platform',
  description: 'Seamless integration and coordination platform',
  keywords: ['integration', 'coordination', 'platform', 'nexus'],
  theme: {
    primary: '#00BCD4',
    secondary: '#1a1a2e',
    accent: '#4DD0E1'
  },
  routes: [
    { path: '/integration', label: 'Integration', labelAr: 'التكامل' },
    { path: '/coordination', label: 'Coordination', labelAr: 'التنسيق' },
    { path: '/networking', label: 'Networking', labelAr: 'الشبكات' }
  ],
  i18n: {
    en: {
      title: 'Nexus',
      tagline: 'Integration Platform',
      description: 'Seamlessly connect all your business systems'
    },
    ar: {
      title: 'نكسس',
      tagline: 'منصة التكامل',
      description: 'اربط جميع أنظمة عملك بسلاسة'
    }
  },
  category: 'network',
  status: 'active',
  related: ['connection', 'system', 'dx']
};

export default config;
