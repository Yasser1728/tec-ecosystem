import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Legend',
  slug: 'legend',
  title: 'Legend - Legacy Building',
  description: 'Build your legacy with legendary status',
  keywords: ['legend', 'legacy', 'status', 'elite'],
  theme: {
    primary: '#E91E63',
    secondary: '#1a1a2e',
    accent: '#F06292'
  },
  routes: [
    { path: '/legacy', label: 'Legacy', labelAr: 'الإرث' },
    { path: '/achievements', label: 'Achievements', labelAr: 'الإنجازات' },
    { path: '/hall-of-fame', label: 'Hall of Fame', labelAr: 'قاعة المشاهير' }
  ],
  i18n: {
    en: {
      title: 'Legend',
      tagline: 'Legacy Building',
      description: 'Build a legacy that lasts forever'
    },
    ar: {
      title: 'ليجند',
      tagline: 'بناء الإرث',
      description: 'ابنِ إرثاً يدوم للأبد'
    }
  },
  category: 'elite',
  status: 'active',
  related: ['titan', 'epic', 'elite']
};

export default config;
