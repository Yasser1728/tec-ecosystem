/**
 * TEC Ecosystem Domain Types
 * كل domain مستقل بقيمته
 */

export type DomainCategory = 
  | 'finance' 
  | 'realestate' 
  | 'travel' 
  | 'commerce' 
  | 'network' 
  | 'tech' 
  | 'elite' 
  | 'hub';

export type DomainStatus = 'active' | 'coming_soon' | 'maintenance';

export interface DomainRoute {
  path: string;
  label: string;
  labelAr: string;
  icon?: string;
}

export interface DomainI18n {
  title: string;
  tagline: string;
  description: string;
}

export interface DomainTheme {
  primary: string;
  secondary: string;
  accent?: string;
}

export interface DomainConfig {
  // Basic Info
  name: string;
  slug: string;
  
  // SEO & Metadata
  title: string;
  description: string;
  keywords: string[];
  
  // Theme
  theme: DomainTheme;
  
  // Routes
  routes: DomainRoute[];
  
  // i18n
  i18n: {
    en: DomainI18n;
    ar: DomainI18n;
  };
  
  // Category & Status
  category: DomainCategory;
  status: DomainStatus;
  
  // Related domains
  related: string[];
}

export interface DomainRegistry {
  finance: string[];
  realestate: string[];
  travel: string[];
  commerce: string[];
  network: string[];
  tech: string[];
  elite: string[];
  hub: string[];
}
