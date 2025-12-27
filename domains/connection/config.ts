import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Connection',
  slug: 'connection',
  title: 'Connection - Network Hub',
  description: 'Professional networking and business connections',
  keywords: ['networking', 'connections', 'business', 'professionals'],
  theme: {
    primary: '#009688',
    secondary: '#1a1a2e',
    accent: '#4DB6AC'
  },
  routes: [
    { path: '/network', label: 'Network', labelAr: 'الشبكة' },
    { path: '/events', label: 'Events', labelAr: 'الفعاليات' },
    { path: '/community', label: 'Community', labelAr: 'المجتمع' }
  ],
  i18n: {
    en: {
      title: 'Connection',
      tagline: 'Network Hub',
      description: 'Connect with professionals worldwide'
    },
    ar: {
      title: 'كونكشن',
      tagline: 'مركز الشبكة',
      description: 'تواصل مع المحترفين حول العالم'
    }
  },
  category: 'network',
  status: 'active',
  related: ['nexus', 'commerce', 'tec']
};

export default config;
