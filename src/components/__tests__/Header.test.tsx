import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { Header } from '../Header';
import { OnboardingProvider, useOnboarding } from '../../context/OnboardingContext';
import { logout } from '../../../assets/auth';

jest.mock('../../../assets/auth');

const mockLogout = logout as jest.MockedFunction<typeof logout>;

const wrapper = ({ children }: { children: ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

// Helper component to access context state for testing
function TestContextReader() {
  const { state } = useOnboarding();
  return (
    <div data-testid="context-state">
      {JSON.stringify({
        step: state.step,
        user: state.user ? { id: state.user.id, name: state.user.name } : null,
      })}
    </div>
  );
}

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render header title', () => {
    render(<Header />, { wrapper });
    expect(screen.getByText(/gym membership onboarding/i)).toBeInTheDocument();
  });

  it('should not show logout button when user is not logged in', () => {
    render(<Header />, { wrapper });
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
  });

  it('should show logout button and user info when user is logged in', () => {
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
    expect(screen.getByText(/welcome, test user/i)).toBeInTheDocument();
  });

  it('should show step indicator when user is logged in', () => {
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
    // Use getAllByText since "Membership" appears in both the header and step indicator
    const membershipElements = screen.getAllByText(/membership/i);
    expect(membershipElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/payment/i)).toBeInTheDocument();
  });

  it('should handle logout and reset state', async () => {
    mockLogout.mockImplementation(() => {});
    
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
    localStorage.setItem('auth_token', 'test-token');

    render(
      <>
        <Header />
        <TestContextReader />
      </>,
      { wrapper }
    );
    
    const logoutButton = screen.getByText(/logout/i);
    
    await act(async () => {
      await userEvent.click(logoutButton);
    });

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    // Note: localStorage.getItem('onboarding_state') will not be null because
    // the context's useEffect saves the reset state back to localStorage.
    // Instead, we verify that the state itself is reset.
    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      expect(contextState.step).toBe(1);
      expect(contextState.user).toBeNull();
    });

    // Verify that the saved state in localStorage is the reset state
    const savedState = localStorage.getItem('onboarding_state');
    expect(savedState).toBeTruthy();
    if (savedState) {
      const parsed = JSON.parse(savedState);
      expect(parsed.step).toBe(1);
      expect(parsed.user).toBeNull();
    }
  });
});

