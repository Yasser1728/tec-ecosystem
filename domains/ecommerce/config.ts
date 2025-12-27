import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Ecommerce',
  slug: 'ecommerce',
  title: 'Ecommerce - Digital Marketplace',
  description: 'Premium digital marketplace and online retail',
  keywords: ['ecommerce', 'marketplace', 'retail', 'shopping'],
  theme: {
    primary: '#673AB7',
    secondary: '#1a1a2e',
    accent: '#9575CD'
  },
  routes: [
    { path: '/marketplace', label: 'Marketplace', labelAr: 'السوق' },
    { path: '/products', label: 'Products', labelAr: 'المنتجات' },
    { path: '/vendors', label: 'Vendors', labelAr: 'الموردين' }
  ],
  i18n: {
    en: {
      title: 'Ecommerce',
      tagline: 'Digital Marketplace',
      description: 'Premium online shopping experience'
    },
    ar: {
      title: 'إيكوميرس',
      tagline: 'السوق الرقمي',
      description: 'تجربة تسوق متميزة عبر الإنترنت'
    }
  },
  category: 'commerce',
  status: 'active',
  related: ['commerce', 'fundx', 'titan']
};

export default config;
