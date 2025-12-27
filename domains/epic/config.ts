import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Epic',
  slug: 'epic',
  title: 'Epic - Legendary Experiences',
  description: 'Epic and legendary experiences for the elite',
  keywords: ['epic', 'legendary', 'experiences', 'elite'],
  theme: {
    primary: '#9C27B0',
    secondary: '#1a1a2e',
    accent: '#BA68C8'
  },
  routes: [
    { path: '/experiences', label: 'Experiences', labelAr: 'التجارب' },
    { path: '/events', label: 'Events', labelAr: 'الفعاليات' },
    { path: '/access', label: 'Access', labelAr: 'الوصول' }
  ],
  i18n: {
    en: {
      title: 'Epic',
      tagline: 'Legendary Experiences',
      description: 'Create unforgettable epic moments'
    },
    ar: {
      title: 'إيبك',
      tagline: 'تجارب أسطورية',
      description: 'اصنع لحظات ملحمية لا تُنسى'
    }
  },
  category: 'elite',
  status: 'active',
  related: ['titan', 'legend', 'vip']
};

export default config;
