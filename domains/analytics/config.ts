import type { DomainConfig } from '@/types/domain';

const config: DomainConfig = {
  name: 'Analytics',
  slug: 'analytics',
  title: 'Analytics - Business Intelligence',
  description: 'Advanced analytics and business intelligence',
  keywords: ['analytics', 'business intelligence', 'data', 'insights'],
  theme: {
    primary: '#4CAF50',
    secondary: '#1a1a2e',
    accent: '#81C784'
  },
  routes: [
    { path: '/dashboard', label: 'Dashboard', labelAr: 'لوحة التحكم' },
    { path: '/reports', label: 'Reports', labelAr: 'التقارير' },
    { path: '/insights', label: 'Insights', labelAr: 'الرؤى' }
  ],
  i18n: {
    en: {
      title: 'Analytics',
      tagline: 'Business Intelligence',
      description: 'Data-driven insights for your business'
    },
    ar: {
      title: 'أناليتكس',
      tagline: 'ذكاء الأعمال',
      description: 'رؤى مستندة إلى البيانات لعملك'
    }
  },
  category: 'tech',
  status: 'active',
  related: ['system', 'dx', 'alert']
};

export default config;
