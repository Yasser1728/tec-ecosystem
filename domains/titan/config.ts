import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Titan',
  slug: 'titan',
  title: 'Titan - Elite Membership',
  description: 'Ultimate elite membership and exclusive benefits',
  keywords: ['elite', 'membership', 'exclusive', 'premium'],
  theme: {
    primary: '#FFD700',
    secondary: '#1a1a2e',
    accent: '#FFC400'
  },
  routes: [
    { path: '/membership', label: 'Membership', labelAr: 'العضوية' },
    { path: '/benefits', label: 'Benefits', labelAr: 'المزايا' },
    { path: '/exclusive', label: 'Exclusive', labelAr: 'حصري' }
  ],
  i18n: {
    en: {
      title: 'Titan',
      tagline: 'Elite Membership',
      description: 'Join the most exclusive membership club'
    },
    ar: {
      title: 'تيتان',
      tagline: 'عضوية النخبة',
      description: 'انضم لأكثر نادي العضوية حصرية'
    }
  },
  category: 'elite',
  status: 'active',
  related: ['epic', 'legend', 'vip']
};

export default config;
