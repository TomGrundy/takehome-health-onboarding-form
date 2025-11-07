import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { MembershipTierStep } from './MembershipTierStep';
import { OnboardingProvider, useOnboarding } from '../../context/OnboardingContext';

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
        selectedMembershipTier: state.selectedMembershipTier
          ? {
              id: state.selectedMembershipTier.id,
              name: state.selectedMembershipTier.name,
            }
          : null,
      })}
    </div>
  );
}

describe('MembershipTierStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render membership tiers', () => {
    render(<MembershipTierStep />, { wrapper });
    expect(screen.getByText(/select your membership tier/i)).toBeInTheDocument();
    // Use getAllByText since membership tier names may appear multiple times
    const basicMemberships = screen.getAllByText(/basic membership/i);
    expect(basicMemberships.length).toBeGreaterThan(0);
    const premiumMemberships = screen.getAllByText(/premium membership/i);
    expect(premiumMemberships.length).toBeGreaterThan(0);
  });

  it('should allow selecting a tier and save to context', async () => {
    render(
      <>
        <MembershipTierStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    
    const selectButtons = screen.getAllByText(/select plan/i);
    await act(async () => {
      await userEvent.click(selectButtons[0]);
    });

    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      expect(contextState.step).toBe(3);
      expect(contextState.selectedMembershipTier).toBeTruthy();
      expect(contextState.selectedMembershipTier.id).toBeTruthy();
      expect(contextState.selectedMembershipTier.name).toBeTruthy();
    });
  });

  it('should advance to step 3 after tier selection', async () => {
    render(
      <>
        <MembershipTierStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    
    const selectButtons = screen.getAllByText(/select plan/i);
    await act(async () => {
      await userEvent.click(selectButtons[0]);
    });

    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      expect(contextState.step).toBe(3);
    });
  });

  it('should highlight selected tier', async () => {
    render(<MembershipTierStep />, { wrapper });
    
    const selectButtons = screen.getAllByText(/select plan/i);
    const firstTierCard = selectButtons[0].closest('.tier-card');
    
    await act(async () => {
      await userEvent.click(selectButtons[0]);
    });

    await waitFor(() => {
      expect(firstTierCard).toHaveClass('selected');
    });
  });

  it('should display tier features', () => {
    render(<MembershipTierStep />, { wrapper });
    expect(screen.getByText(/access to gym floor/i)).toBeInTheDocument();
  });

  it('should display tier prices', () => {
    render(<MembershipTierStep />, { wrapper });
    // Check that price format is displayed (should contain $ and numbers)
    const priceElements = screen.getAllByText(/\$\d+\.\d{2}/);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  it('should persist selected tier from context', () => {
    const initialState = {
      step: 2,
      user: null,
      selectedMembershipTier: {
        id: 'basic',
        name: 'Basic Membership',
        price: 29.99,
        billingPeriod: 'month' as const,
        features: ['Access to gym floor'],
        accessHours: '6am-10pm',
      },
      creditCardData: null,
      selectedHealthConditions: [],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    
    render(<MembershipTierStep />, { wrapper });
    const tierCards = document.querySelectorAll('.tier-card.selected');
    expect(tierCards.length).toBeGreaterThan(0);
  });
});

