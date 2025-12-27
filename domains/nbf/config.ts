import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'NBF',
  slug: 'nbf',
  title: 'NBF - Network Banking & Finance',
  description: 'Decentralized banking solutions for Pi Network',
  keywords: ['banking', 'finance', 'DeFi', 'pi network'],
  theme: {
    primary: '#2196F3',
    secondary: '#1a1a2e',
    accent: '#64B5F6'
  },
  routes: [
    { path: '/accounts', label: 'Accounts', labelAr: 'الحسابات' },
    { path: '/services', label: 'Banking Services', labelAr: 'الخدمات المصرفية' },
    { path: '/transfers', label: 'Transfers', labelAr: 'التحويلات' }
  ],
  i18n: {
    en: {
      title: 'NBF',
      tagline: 'Network Banking & Finance',
      description: 'Decentralized banking for the Pi ecosystem'
    },
    ar: {
      title: 'NBF',
      tagline: 'الخدمات المصرفية والمالية',
      description: 'الخدمات المصرفية اللامركزية لنظام Pi'
    }
  },
  category: 'finance',
  status: 'active',
  related: ['fundx', 'assets', 'insure']
};

export default config;
