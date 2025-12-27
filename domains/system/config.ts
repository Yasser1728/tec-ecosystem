import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'System',
  slug: 'system',
  title: 'System - Infrastructure Management',
  description: 'Enterprise system management and infrastructure',
  keywords: ['systems', 'infrastructure', 'management', 'enterprise'],
  theme: {
    primary: '#607D8B',
    secondary: '#1a1a2e',
    accent: '#90A4AE'
  },
  routes: [
    { path: '/infrastructure', label: 'Infrastructure', labelAr: 'البنية التحتية' },
    { path: '/monitoring', label: 'Monitoring', labelAr: 'المراقبة' },
    { path: '/management', label: 'Management', labelAr: 'الإدارة' }
  ],
  i18n: {
    en: {
      title: 'System',
      tagline: 'Infrastructure Management',
      description: 'Robust enterprise system management'
    },
    ar: {
      title: 'سيستم',
      tagline: 'إدارة البنية التحتية',
      description: 'إدارة قوية لأنظمة المؤسسات'
    }
  },
  category: 'tech',
  status: 'active',
  related: ['dx', 'nx', 'analytics']
};

export default config;
