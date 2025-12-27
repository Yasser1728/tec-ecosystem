import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Life',
  slug: 'life',
  title: 'Life - Life Insurance & Financial Planning',
  description: 'Life insurance and long-term financial planning services',
  keywords: ['life insurance', 'financial planning', 'protection', 'longevity'],
  theme: {
    primary: '#00BCD4',
    secondary: '#1a1a2e',
    accent: '#4DD0E1'
  },
  routes: [
    { path: '/wellness', label: 'Life Insurance', labelAr: 'التأمين على الحياة' },
    { path: '/programs', label: 'Planning', labelAr: 'التخطيط' },
    { path: '/coaching', label: 'Advisory', labelAr: 'الاستشارات' }
  ],
  i18n: {
    en: {
      title: 'Life',
      tagline: 'Life Insurance & Financial Planning',
      description: 'Comprehensive life insurance and financial planning'
    },
    ar: {
      title: 'لايف',
      tagline: 'التأمين على الحياة والتخطيط المالي',
      description: 'تأمين شامل على الحياة وتخطيط مالي'
    }
  },
  category: 'finance',
  status: 'active',
  related: ['insure', 'assets', 'tec']
};

export default config;
