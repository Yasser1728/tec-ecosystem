import React from 'react';
import type { ServiceCardProps } from '@/types/components';

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  icon, 
  href, 
  onClick 
}) => {
  const content = (
    <div className="service-card">
      {icon && <span className="service-icon">{icon}</span>}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
  
  if (href) {
    return <a href={href}>{content}</a>;
  }
  
  if (onClick) {
    return <button onClick={onClick}>{content}</button>;
  }
  
  return content;
};

export default ServiceCard;
