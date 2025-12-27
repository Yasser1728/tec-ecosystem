import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Zone',
  slug: 'zone',
  title: 'Zone - Strategic Locations',
  description: 'Premium locations and smart city developments',
  keywords: ['locations', 'smart city', 'development', 'real estate'],
  theme: {
    primary: '#FF9800',
    secondary: '#1a1a2e',
    accent: '#FFB74D'
  },
  routes: [
    { path: '/locations', label: 'Locations', labelAr: 'المواقع' },
    { path: '/maps', label: 'Maps', labelAr: 'الخرائط' },
    { path: '/invest', label: 'Invest', labelAr: 'استثمر' }
  ],
  i18n: {
    en: {
      title: 'Zone',
      tagline: 'Strategic Locations',
      description: 'Discover premium locations and opportunities'
    },
    ar: {
      title: 'زون',
      tagline: 'مواقع استراتيجية',
      description: 'اكتشف المواقع والفرص المتميزة'
    }
  },
  category: 'realestate',
  status: 'active',
  related: ['estate', 'brookfield', 'analytics']
};

export default config;
