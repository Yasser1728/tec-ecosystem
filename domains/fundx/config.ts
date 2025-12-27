import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'FundX',
  slug: 'fundx',
  title: 'FundX - Pi Investment Platform',
  description: 'ROI calculator and investment strategies for Pi Network',
  keywords: ['pi network', 'investment', 'ROI', 'calculator'],
  theme: {
    primary: '#FFD700',
    secondary: '#1a1a2e',
    accent: '#f5a623'
  },
  routes: [
    { path: '/start', label: 'Getting Started', labelAr: 'دليل البداية' },
    { path: '/strategies', label: 'Investment Strategies', labelAr: 'استراتيجيات الاستثمار' },
    { path: '/calculator', label: 'ROI Calculator', labelAr: 'حاسبة العائد' }
  ],
  i18n: {
    en: {
      title: 'FundX',
      tagline: 'Smart Pi Investments',
      description: 'Your gateway to Pi investment opportunities'
    },
    ar: {
      title: 'فندكس',
      tagline: 'استثمارات Pi الذكية',
      description: 'بوابتك لفرص استثمار Pi'
    }
  },
  category: 'finance',
  status: 'active',
  related: ['assets', 'nbf', 'insure']
};

export default config;
