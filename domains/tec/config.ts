import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'TEC',
  slug: 'tec',
  title: 'TEC - Titan Elite Commerce Hub',
  description: 'Central hub for the entire TEC Ecosystem',
  keywords: ['TEC', 'hub', 'ecosystem', 'commerce'],
  theme: {
    primary: '#1a1a2e',
    secondary: '#FFD700',
    accent: '#f5a623'
  },
  routes: [
    { path: '/about', label: 'About', labelAr: 'عن' },
    { path: '/domains', label: 'Domains', labelAr: 'المجالات' },
    { path: '/contact', label: 'Contact', labelAr: 'اتصل' }
  ],
  i18n: {
    en: {
      title: 'TEC',
      tagline: 'Titan Elite Commerce',
      description: 'Your gateway to 24 sovereign business domains'
    },
    ar: {
      title: 'TEC',
      tagline: 'تيتان إيليت كوميرس',
      description: 'بوابتك إلى 24 مجال أعمال سيادي'
    }
  },
  category: 'hub',
  status: 'active',
  related: ['titan', 'commerce', 'connection']
};

export default config;
