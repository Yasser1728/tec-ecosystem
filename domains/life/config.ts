import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Life',
  slug: 'life',
  title: 'Life - Lifestyle & Wellness',
  description: 'Lifestyle services and wellness programs',
  keywords: ['lifestyle', 'wellness', 'health', 'longevity'],
  theme: {
    primary: '#00BCD4',
    secondary: '#1a1a2e',
    accent: '#4DD0E1'
  },
  routes: [
    { path: '/wellness', label: 'Wellness', labelAr: 'الصحة' },
    { path: '/programs', label: 'Programs', labelAr: 'البرامج' },
    { path: '/coaching', label: 'Coaching', labelAr: 'التدريب' }
  ],
  i18n: {
    en: {
      title: 'Life',
      tagline: 'Lifestyle & Wellness',
      description: 'Enhance your lifestyle with premium services'
    },
    ar: {
      title: 'لايف',
      tagline: 'نمط الحياة والصحة',
      description: 'حسّن نمط حياتك بخدمات متميزة'
    }
  },
  category: 'finance',
  status: 'active',
  related: ['insure', 'assets', 'tec']
};

export default config;
