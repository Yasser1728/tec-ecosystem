/**
 * Component Props Types
 */

import { ReactNode } from 'react';
import { DomainConfig } from './domain';

export interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export interface HeaderProps {
  domain?: DomainConfig;
  showNav?: boolean;
  className?: string;
}

export interface FooterProps {
  domain?: DomainConfig;
  className?: string;
}

export interface ServiceCardProps {
  title: string;
  description: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
}

export interface DomainCardProps {
  domain: DomainConfig;
  showRoutes?: boolean;
  className?: string;
}

export interface LanguageToggleProps {
  currentLang: 'en' | 'ar';
  onToggle: (lang: 'en' | 'ar') => void;
}
