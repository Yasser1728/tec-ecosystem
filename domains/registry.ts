import type { DomainRegistry, DomainConfig } from '@/types/domain';

export const DOMAIN_CATEGORIES: DomainRegistry = {
  finance: ['fundx', 'assets', 'nbf', 'insure', 'life'],
  realestate: ['estate', 'brookfield', 'zone'],
  travel: ['explorer', 'vip', 'elite'],
  commerce: ['commerce', 'ecommerce'],
  network: ['connection', 'nexus'],
  tech: ['dx', 'nx', 'system', 'analytics', 'alert'],
  elite: ['titan', 'epic', 'legend'],
  hub: ['tec']
};

export const ALL_DOMAINS: string[] = Object.values(DOMAIN_CATEGORIES).flat();

export const getDomainConfig = async (slug: string): Promise<DomainConfig | null> => {
  try {
    const config = await import(`./${slug}/config`);
    return config.default as DomainConfig;
  } catch (error) {
    console.error(`Domain config not found: ${slug}`);
    return null;
  }
};

export const getDomainsByCategory = (category: keyof DomainRegistry): string[] => {
  return DOMAIN_CATEGORIES[category] || [];
};

export const isDomainValid = (slug: string): boolean => {
  return ALL_DOMAINS.includes(slug);
};
