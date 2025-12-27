/**
 * Unit Tests for ServiceCard Component
 */

import { render, screen } from '@testing-library/react';
import ServiceCard from '../../components/ServiceCard';

describe('ServiceCard Component', () => {
  it('should render title and description', () => {
    render(<ServiceCard title="Test Title" description="Test Description" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render as a div with correct structure', () => {
    const { container } = render(
      <ServiceCard title="Service" description="Description" />
    );
    
    const card = container.firstChild;
    expect(card.tagName).toBe('DIV');
    expect(card.querySelector('h3')).toBeInTheDocument();
    expect(card.querySelector('p')).toBeInTheDocument();
  });

  it('should handle empty props gracefully', () => {
    const { container } = render(<ServiceCard title="" description="" />);
    
    expect(container.querySelector('h3')).toBeInTheDocument();
    expect(container.querySelector('p')).toBeInTheDocument();
  });
});
