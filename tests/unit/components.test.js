/**
 * Unit Tests for Components
 */

import { render, screen } from '@testing-library/react';
import Footer from '../../public/components/Footer';
import Header from '../../public/components/Header';
import ServiceCard from '../../components/ServiceCard';
import LanguageToggle from '../../components/LanguageToggle';

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

describe('ServiceCard Component', () => {
  it('should render with title and description', () => {
    const title = 'Test Service';
    const description = 'Test Description';
    
    render(<ServiceCard title={title} description={description} />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('should render title as h3 element', () => {
    render(<ServiceCard title="Test" description="Desc" />);
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test');
  });
});

describe('LanguageToggle Component', () => {
  it('should render both language buttons', () => {
    const mockSetLanguage = jest.fn();
    render(<LanguageToggle language="en" setLanguage={mockSetLanguage} />);
    
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('ع')).toBeInTheDocument();
  });

  it('should call setLanguage when button is clicked', () => {
    const mockSetLanguage = jest.fn();
    render(<LanguageToggle language="en" setLanguage={mockSetLanguage} />);
    
    const arButton = screen.getByText('ع');
    arButton.click();
    
    expect(mockSetLanguage).toHaveBeenCalledWith('ar');
  });

  it('should highlight active language', () => {
    const mockSetLanguage = jest.fn();
    const { rerender } = render(<LanguageToggle language="en" setLanguage={mockSetLanguage} />);
    
    const enButton = screen.getByText('EN');
    expect(enButton).toHaveClass('bg-tec-green');
    
    rerender(<LanguageToggle language="ar" setLanguage={mockSetLanguage} />);
    
    const arButton = screen.getByText('ع');
    expect(arButton).toHaveClass('bg-tec-green');
  });
});
