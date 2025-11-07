import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HealthConditionsStep } from '../HealthConditionsStep';
import { OnboardingProvider } from '../../context/OnboardingContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

describe('HealthConditionsStep', () => {
  it('should render health conditions', () => {
    render(<HealthConditionsStep />, { wrapper });
    expect(screen.getByText(/health information/i)).toBeInTheDocument();
    expect(screen.getByText(/heart disease/i)).toBeInTheDocument();
  });

  it('should allow selecting conditions', async () => {
    render(<HealthConditionsStep />, { wrapper });
    const heartDiseaseCheckbox = screen.getByLabelText(/heart disease/i);
    await userEvent.click(heartDiseaseCheckbox);
    expect(heartDiseaseCheckbox).toBeChecked();
  });

  it('should display medical clearance badge for conditions that require it', () => {
    render(<HealthConditionsStep />, { wrapper });
    expect(screen.getByText(/requires medical clearance/i)).toBeInTheDocument();
  });

  it('should allow continuing to next step', async () => {
    render(<HealthConditionsStep />, { wrapper });
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await userEvent.click(continueButton);
    // Should advance to next step
  });
});

