import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { SummaryStep } from '../SummaryStep';
import { OnboardingProvider } from '../../context/OnboardingContext';

const wrapper = ({ children }: { children: ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

describe('SummaryStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render summary information', () => {
    render(<SummaryStep />, { wrapper });
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/your membership qr code/i)).toBeInTheDocument();
  });

  it('should display QR code', () => {
    render(<SummaryStep />, { wrapper });
    const qrCode = document.querySelector('.qr-code');
    expect(qrCode).toBeInTheDocument();
    expect(qrCode?.querySelector('svg')).toBeInTheDocument();
  });

  it('should display member information section with user data', () => {
    const initialState = {
      step: 5,
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'John Doe',
        membershipType: 'premium' as const,
        memberSince: '2024-01-01',
      },
      selectedMembershipTier: null,
      creditCardData: null,
      selectedHealthConditions: [],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    
    render(<SummaryStep />, { wrapper });
    expect(screen.getByText(/member information/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  it('should display N/A when user data is missing', () => {
    const initialState = {
      step: 5,
      user: null,
      selectedMembershipTier: null,
      creditCardData: null,
      selectedHealthConditions: [],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    
    render(<SummaryStep />, { wrapper });
    const naValues = screen.getAllByText(/n\/a/i);
    expect(naValues.length).toBeGreaterThan(0);
  });

  it('should display membership plan section with tier data', () => {
    const initialState = {
      step: 5,
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'John Doe',
        membershipType: 'premium' as const,
        memberSince: '2024-01-01',
      },
      selectedMembershipTier: {
        id: 'premium',
        name: 'Premium Membership',
        price: 49.99,
        billingPeriod: 'month' as const,
        features: ['Access to gym floor', 'Personal training'],
        accessHours: '24/7',
      },
      creditCardData: null,
      selectedHealthConditions: [],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    
    render(<SummaryStep />, { wrapper });
    expect(screen.getByText(/membership plan/i)).toBeInTheDocument();
    expect(screen.getByText(/premium membership/i)).toBeInTheDocument();
    expect(screen.getByText(/\$49\.99/i)).toBeInTheDocument();
    expect(screen.getByText(/24\/7/i)).toBeInTheDocument();
  });

  it('should display health conditions when selected', () => {
    const initialState = {
      step: 5,
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'John Doe',
        membershipType: 'premium' as const,
        memberSince: '2024-01-01',
      },
      selectedMembershipTier: {
        id: 'premium',
        name: 'Premium Membership',
        price: 49.99,
        billingPeriod: 'month' as const,
        features: [],
        accessHours: '24/7',
      },
      creditCardData: null,
      selectedHealthConditions: ['heart-disease', 'diabetes'],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    
    render(<SummaryStep />, { wrapper });
    expect(screen.getByText(/health conditions/i)).toBeInTheDocument();
  });

  it('should not display health conditions section when none selected', () => {
    const initialState = {
      step: 5,
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'John Doe',
        membershipType: 'premium' as const,
        memberSince: '2024-01-01',
      },
      selectedMembershipTier: {
        id: 'premium',
        name: 'Premium Membership',
        price: 49.99,
        billingPeriod: 'month' as const,
        features: [],
        accessHours: '24/7',
      },
      creditCardData: null,
      selectedHealthConditions: [],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    
    render(<SummaryStep />, { wrapper });
    expect(screen.queryByText(/health conditions/i)).not.toBeInTheDocument();
  });
});

