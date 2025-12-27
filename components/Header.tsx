import React from 'react';
import type { HeaderProps } from '@/types/components';

const Header: React.FC<HeaderProps> = ({ domain, showNav = true, className = '' }) => {
  return (
    <header className={`header ${className}`}>
      <div className="header-content">
        <h1>{domain?.name || 'TEC Ecosystem'}</h1>
        {showNav && domain?.routes && (
          <nav>
            {domain.routes.map((route) => (
              <a key={route.path} href={`/${domain.slug}${route.path}`}>
                {route.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
