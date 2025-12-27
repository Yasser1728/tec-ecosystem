import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Elite',
  slug: 'elite',
  title: 'Elite - Premium Travel Experiences',
  description: 'Ultra-premium travel and lifestyle experiences',
  keywords: ['elite', 'premium', 'luxury', 'travel'],
  theme: {
    primary: '#9C27B0',
    secondary: '#1a1a2e',
    accent: '#BA68C8'
  },
  routes: [
    { path: '/experiences', label: 'Experiences', labelAr: 'التجارب' },
    { path: '/concierge', label: 'Concierge', labelAr: 'الكونسيرج' },
    { path: '/membership', label: 'Membership', labelAr: 'العضوية' }
  ],
  i18n: {
    en: {
      title: 'Elite',
      tagline: 'Premium Travel Experiences',
      description: 'Ultra-premium travel for the discerning traveler'
    },
    ar: {
      title: 'إيليت',
      tagline: 'تجارب سفر متميزة',
      description: 'سفر فائق الرقي للمسافر المميز'
    }
  },
  category: 'travel',
  status: 'active',
  related: ['vip', 'explorer', 'legend']
};

export default config;
