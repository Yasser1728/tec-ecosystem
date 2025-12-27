import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Explorer',
  slug: 'explorer',
  title: 'Explorer - Travel & Adventure',
  description: 'Premium travel experiences and adventure packages',
  keywords: ['travel', 'adventure', 'luxury', 'experiences'],
  theme: {
    primary: '#E91E63',
    secondary: '#1a1a2e',
    accent: '#F06292'
  },
  routes: [
    { path: '/destinations', label: 'Destinations', labelAr: 'الوجهات' },
    { path: '/packages', label: 'Packages', labelAr: 'الباقات' },
    { path: '/experiences', label: 'Experiences', labelAr: 'التجارب' }
  ],
  i18n: {
    en: {
      title: 'Explorer',
      tagline: 'Travel & Adventure',
      description: 'Discover extraordinary travel experiences'
    },
    ar: {
      title: 'إكسبلورر',
      tagline: 'السفر والمغامرة',
      description: 'اكتشف تجارب سفر استثنائية'
    }
  },
  category: 'travel',
  status: 'active',
  related: ['vip', 'elite', 'titan']
};

export default config;
