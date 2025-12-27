import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Commerce',
  slug: 'commerce',
  title: 'Commerce - Business Solutions',
  description: 'Enterprise commerce solutions and B2B services',
  keywords: ['commerce', 'business', 'B2B', 'enterprise'],
  theme: {
    primary: '#3F51B5',
    secondary: '#1a1a2e',
    accent: '#7986CB'
  },
  routes: [
    { path: '/solutions', label: 'Solutions', labelAr: 'الحلول' },
    { path: '/services', label: 'Services', labelAr: 'الخدمات' },
    { path: '/partners', label: 'Partners', labelAr: 'الشركاء' }
  ],
  i18n: {
    en: {
      title: 'Commerce',
      tagline: 'Business Solutions',
      description: 'Enterprise commerce solutions for modern business'
    },
    ar: {
      title: 'كوميرس',
      tagline: 'حلول الأعمال',
      description: 'حلول تجارية للأعمال الحديثة'
    }
  },
  category: 'commerce',
  status: 'active',
  related: ['ecommerce', 'system', 'dx']
};

export default config;
