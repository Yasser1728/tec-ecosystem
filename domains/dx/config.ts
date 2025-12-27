import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'DX',
  slug: 'dx',
  title: 'DX - Digital Transformation',
  description: 'Complete digital transformation solutions',
  keywords: ['digital transformation', 'technology', 'innovation', 'modernization'],
  theme: {
    primary: '#2196F3',
    secondary: '#1a1a2e',
    accent: '#64B5F6'
  },
  routes: [
    { path: '/services', label: 'Services', labelAr: 'الخدمات' },
    { path: '/consulting', label: 'Consulting', labelAr: 'الاستشارات' },
    { path: '/solutions', label: 'Solutions', labelAr: 'الحلول' }
  ],
  i18n: {
    en: {
      title: 'DX',
      tagline: 'Digital Transformation',
      description: 'Transform your business for the digital age'
    },
    ar: {
      title: 'دي إكس',
      tagline: 'التحول الرقمي',
      description: 'حوّل عملك للعصر الرقمي'
    }
  },
  category: 'tech',
  status: 'active',
  related: ['nx', 'system', 'analytics']
};

export default config;
