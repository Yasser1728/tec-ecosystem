import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Brookfield',
  slug: 'brookfield',
  title: 'Brookfield - Strategic Developments',
  description: 'Strategic real estate development and infrastructure',
  keywords: ['development', 'infrastructure', 'real estate', 'construction'],
  theme: {
    primary: '#607D8B',
    secondary: '#1a1a2e',
    accent: '#90A4AE'
  },
  routes: [
    { path: '/projects', label: 'Projects', labelAr: 'المشاريع' },
    { path: '/development', label: 'Development', labelAr: 'التطوير' },
    { path: '/infrastructure', label: 'Infrastructure', labelAr: 'البنية التحتية' }
  ],
  i18n: {
    en: {
      title: 'Brookfield',
      tagline: 'Strategic Developments',
      description: 'Leading real estate development company'
    },
    ar: {
      title: 'بروكفيلد',
      tagline: 'تطويرات استراتيجية',
      description: 'شركة رائدة في التطوير العقاري'
    }
  },
  category: 'realestate',
  status: 'active',
  related: ['estate', 'zone', 'system']
};

export default config;
