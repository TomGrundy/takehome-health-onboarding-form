import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MembershipTierStep } from '../MembershipTierStep';
import { OnboardingProvider } from '../../context/OnboardingContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

describe('MembershipTierStep', () => {
  it('should render membership tiers', () => {
    render(<MembershipTierStep />, { wrapper });
    expect(screen.getByText(/select your membership tier/i)).toBeInTheDocument();
    expect(screen.getByText(/basic membership/i)).toBeInTheDocument();
    expect(screen.getByText(/premium membership/i)).toBeInTheDocument();
  });

  it('should allow selecting a tier', async () => {
    render(<MembershipTierStep />, { wrapper });
    const selectButtons = screen.getAllByText(/select plan/i);
    await userEvent.click(selectButtons[0]);
    // The step should advance to 3 after selection
  });

  it('should display tier features', () => {
    render(<MembershipTierStep />, { wrapper });
    expect(screen.getByText(/access to gym floor/i)).toBeInTheDocument();
  });
});

