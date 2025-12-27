import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Assets',
  slug: 'assets',
  title: 'Assets - Portfolio Management',
  description: 'Professional portfolio management and asset allocation',
  keywords: ['assets', 'portfolio', 'management', 'allocation'],
  theme: {
    primary: '#4CAF50',
    secondary: '#1a1a2e',
    accent: '#81C784'
  },
  routes: [
    { path: '/portfolio', label: 'Portfolio', labelAr: 'المحفظة' },
    { path: '/allocation', label: 'Asset Allocation', labelAr: 'توزيع الأصول' },
    { path: '/performance', label: 'Performance', labelAr: 'الأداء' }
  ],
  i18n: {
    en: {
      title: 'Assets',
      tagline: 'Professional Portfolio Management',
      description: 'Manage your digital assets effectively'
    },
    ar: {
      title: 'الأصول',
      tagline: 'إدارة محفظة احترافية',
      description: 'إدارة أصولك الرقمية بفعالية'
    }
  },
  category: 'finance',
  status: 'active',
  related: ['fundx', 'nbf', 'life']
};

export default config;
