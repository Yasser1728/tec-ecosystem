/**
 * Unit Tests for LanguageToggle Component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import LanguageToggle from '../../components/LanguageToggle';

describe('LanguageToggle Component', () => {
  it('should render EN and Arabic buttons', () => {
    const setLanguage = jest.fn();
    render(<LanguageToggle language="en" setLanguage={setLanguage} />);
    
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('ع')).toBeInTheDocument();
  });

  it('should call setLanguage with "en" when EN button is clicked', () => {
    const setLanguage = jest.fn();
    render(<LanguageToggle language="ar" setLanguage={setLanguage} />);
    
    fireEvent.click(screen.getByText('EN'));
    expect(setLanguage).toHaveBeenCalledWith('en');
  });

  it('should call setLanguage with "ar" when Arabic button is clicked', () => {
    const setLanguage = jest.fn();
    render(<LanguageToggle language="en" setLanguage={setLanguage} />);
    
    fireEvent.click(screen.getByText('ع'));
    expect(setLanguage).toHaveBeenCalledWith('ar');
  });

  it('should highlight active language button', () => {
    const setLanguage = jest.fn();
    const { rerender } = render(
      <LanguageToggle language="en" setLanguage={setLanguage} />
    );
    
    const enButton = screen.getByText('EN');
    expect(enButton).toHaveClass('bg-tec-green');
    
    rerender(<LanguageToggle language="ar" setLanguage={setLanguage} />);
    
    const arButton = screen.getByText('ع');
    expect(arButton).toHaveClass('bg-tec-green');
  });
});
