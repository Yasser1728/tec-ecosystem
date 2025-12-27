import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'NX',
  slug: 'nx',
  title: 'NX - Next-Gen Systems',
  description: 'Next-generation technology systems and platforms',
  keywords: ['next-gen', 'systems', 'technology', 'innovation'],
  theme: {
    primary: '#3F51B5',
    secondary: '#1a1a2e',
    accent: '#7986CB'
  },
  routes: [
    { path: '/projects', label: 'Projects', labelAr: 'المشاريع' },
    { path: '/labs', label: 'Labs', labelAr: 'المختبرات' },
    { path: '/insights', label: 'Insights', labelAr: 'الرؤى' }
  ],
  i18n: {
    en: {
      title: 'NX',
      tagline: 'Next-Gen Systems',
      description: 'Building the future of technology'
    },
    ar: {
      title: 'إن إكس',
      tagline: 'أنظمة الجيل القادم',
      description: 'بناء مستقبل التكنولوجيا'
    }
  },
  category: 'tech',
  status: 'active',
  related: ['dx', 'system', 'analytics']
};

export default config;
