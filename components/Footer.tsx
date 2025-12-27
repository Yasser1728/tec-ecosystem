import React from 'react';
import type { FooterProps } from '@/types/components';

const Footer: React.FC<FooterProps> = ({ domain, className = '' }) => {
  return (
    <footer className={`footer ${className}`}>
      <p>© 2024 {domain?.name || 'TEC Ecosystem'}. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
