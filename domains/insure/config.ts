import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Insure',
  slug: 'insure',
  title: 'Insure - Pi Insurance Platform',
  description: 'Decentralized insurance solutions on Pi Network',
  keywords: ['insurance', 'protection', 'coverage', 'pi network'],
  theme: {
    primary: '#9C27B0',
    secondary: '#1a1a2e',
    accent: '#BA68C8'
  },
  routes: [
    { path: '/policies', label: 'Policies', labelAr: 'البوليصات' },
    { path: '/claims', label: 'Claims', labelAr: 'المطالبات' },
    { path: '/coverage', label: 'Coverage', labelAr: 'التغطية' }
  ],
  i18n: {
    en: {
      title: 'Insure',
      tagline: 'Pi Insurance Solutions',
      description: 'Protect your digital assets with smart insurance'
    },
    ar: {
      title: 'إنشور',
      tagline: 'حلول التأمين على Pi',
      description: 'احمِ أصولك الرقمية بالتأمين الذكي'
    }
  },
  category: 'finance',
  status: 'active',
  related: ['fundx', 'nbf', 'life']
};

export default config;
