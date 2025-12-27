/**
 * Unit Tests for Components
 */

import { render, screen } from '@testing-library/react';
import Footer from '../../public/components/Footer';
import Header from '../../public/components/Header';

describe('Footer Component', () => {
  it('should render footer with copyright text', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    expect(screen.getByText(/TEC Ecosystem/i)).toBeInTheDocument();
  });
});

describe('Header Component', () => {
  it('should render header with title', () => {
    render(<Header />);
    
    expect(screen.getByText(/TEC Ecosystem/i)).toBeInTheDocument();
  });

  it('should render as a header element', () => {
    const { container } = render(<Header />);
    
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
