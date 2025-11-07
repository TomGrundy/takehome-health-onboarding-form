import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../Header';
import { OnboardingProvider } from '../../context/OnboardingContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render header title', () => {
    render(<Header />, { wrapper });
    expect(screen.getByText(/gym membership onboarding/i)).toBeInTheDocument();
  });

  it('should show logout button when user is logged in', () => {
    const initialState = {
      step: 2,
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        membershipType: 'premium' as const,
        memberSince: '2024-01-01',
      },
      selectedMembershipTier: null,
      creditCardData: null,
      selectedHealthConditions: [],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    render(<Header />, { wrapper });
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it('should handle logout', async () => {
    const initialState = {
      step: 2,
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        membershipType: 'premium' as const,
        memberSince: '2024-01-01',
      },
      selectedMembershipTier: null,
      creditCardData: null,
      selectedHealthConditions: [],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    render(<Header />, { wrapper });
    const logoutButton = screen.getByText(/logout/i);
    await userEvent.click(logoutButton);
    expect(localStorage.getItem('onboarding_state')).toBeNull();
  });
});

