import { render, screen } from '@testing-library/react';
import { SummaryStep } from '../SummaryStep';
import { OnboardingProvider } from '../../context/OnboardingContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

describe('SummaryStep', () => {
  it('should render summary information', () => {
    render(<SummaryStep />, { wrapper });
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/your membership qr code/i)).toBeInTheDocument();
  });

  it('should display QR code', () => {
    render(<SummaryStep />, { wrapper });
    const qrCode = document.querySelector('.qr-code');
    expect(qrCode).toBeInTheDocument();
  });

  it('should display member information section', () => {
    render(<SummaryStep />, { wrapper });
    expect(screen.getByText(/member information/i)).toBeInTheDocument();
  });

  it('should display membership plan section', () => {
    render(<SummaryStep />, { wrapper });
    expect(screen.getByText(/membership plan/i)).toBeInTheDocument();
  });
});

