import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Estate',
  slug: 'estate',
  title: 'Estate - Premium Properties',
  description: 'Luxury real estate investments and management',
  keywords: ['real estate', 'property', 'luxury', 'investment'],
  theme: {
    primary: '#795548',
    secondary: '#1a1a2e',
    accent: '#A1887F'
  },
  routes: [
    { path: '/properties', label: 'Properties', labelAr: 'العقارات' },
    { path: '/invest', label: 'Invest', labelAr: 'استثمر' },
    { path: '/management', label: 'Management', labelAr: 'الإدارة' }
  ],
  i18n: {
    en: {
      title: 'Estate',
      tagline: 'Premium Real Estate',
      description: 'Invest in luxury properties worldwide'
    },
    ar: {
      title: 'إستيت',
      tagline: 'عقارات فاخرة',
      description: 'استثمر في عقارات فاخرة حول العالم'
    }
  },
  category: 'realestate',
  status: 'active',
  related: ['brookfield', 'zone', 'titan']
};

export default config;
