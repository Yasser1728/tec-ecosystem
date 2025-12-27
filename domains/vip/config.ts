import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'VIP',
  slug: 'vip',
  title: 'VIP - Elite Travel Services',
  description: 'VIP travel services and exclusive experiences',
  keywords: ['VIP', 'luxury travel', 'exclusive', 'premium'],
  theme: {
    primary: '#FFD700',
    secondary: '#1a1a2e',
    accent: '#FFC400'
  },
  routes: [
    { path: '/membership', label: 'Membership', labelAr: 'العضوية' },
    { path: '/events', label: 'Events', labelAr: 'الفعاليات' },
    { path: '/services', label: 'Services', labelAr: 'الخدمات' }
  ],
  i18n: {
    en: {
      title: 'VIP',
      tagline: 'Elite Travel Services',
      description: 'Experience luxury travel at its finest'
    },
    ar: {
      title: 'في آي بي',
      tagline: 'خدمات السفر النخبوية',
      description: 'اختبر السفر الفاخر في أفضل صوره'
    }
  },
  category: 'travel',
  status: 'active',
  related: ['explorer', 'elite', 'epic']
};

export default config;
