import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { HealthConditionsStep } from './HealthConditionsStep';
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
        selectedHealthConditions: state.selectedHealthConditions,
      })}
    </div>
  );
}

describe('HealthConditionsStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render health conditions', async () => {
    render(<HealthConditionsStep />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/heart disease/i)).toBeInTheDocument();
  });

  it('should allow selecting conditions', async () => {
    render(<HealthConditionsStep />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    const heartDiseaseCheckbox = screen.getByLabelText(/heart disease/i);
    await act(async () => {
      await userEvent.click(heartDiseaseCheckbox);
    });
    expect(heartDiseaseCheckbox).toBeChecked();
  });

  it('should allow deselecting conditions', async () => {
    render(<HealthConditionsStep />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    const heartDiseaseCheckbox = screen.getByLabelText(/heart disease/i);
    
    // Select
    await act(async () => {
      await userEvent.click(heartDiseaseCheckbox);
    });
    expect(heartDiseaseCheckbox).toBeChecked();
    
    // Deselect
    await act(async () => {
      await userEvent.click(heartDiseaseCheckbox);
    });
    expect(heartDiseaseCheckbox).not.toBeChecked();
  });

  it('should allow selecting multiple conditions', async () => {
    render(<HealthConditionsStep />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    const heartDiseaseCheckboxes = screen.getAllByLabelText(/heart disease/i);
    const diabetesCheckboxes = screen.queryAllByLabelText(/diabetes/i);
    
    if (heartDiseaseCheckboxes.length > 0 && diabetesCheckboxes.length > 0) {
      await act(async () => {
        await userEvent.click(heartDiseaseCheckboxes[0]);
      });
      await act(async () => {
        await userEvent.click(diabetesCheckboxes[0]);
      });
      expect(heartDiseaseCheckboxes[0]).toBeChecked();
      expect(diabetesCheckboxes[0]).toBeChecked();
    } else {
      // If diabetes doesn't exist in the data, just test that we can select heart disease
      await act(async () => {
        await userEvent.click(heartDiseaseCheckboxes[0]);
      });
      expect(heartDiseaseCheckboxes[0]).toBeChecked();
    }
  });

  it('should display medical clearance badge for conditions that require it', async () => {
    render(<HealthConditionsStep />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    // Use getAllByText since multiple conditions may require medical clearance
    const clearanceBadges = screen.getAllByText(/requires medical clearance/i);
    expect(clearanceBadges.length).toBeGreaterThan(0);
  });

  it('should save selected conditions to context and advance to next step', async () => {
    render(
      <>
        <HealthConditionsStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    
    const heartDiseaseCheckbox = screen.getByLabelText(/heart disease/i);
    await act(async () => {
      await userEvent.click(heartDiseaseCheckbox);
    });
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await act(async () => {
      await userEvent.click(continueButton);
    });

    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      expect(contextState.step).toBe(5);
      expect(contextState.selectedHealthConditions).toContain('heart-disease');
    });
  });

  it('should disable continue button when no conditions are selected', async () => {
    render(
      <>
        <HealthConditionsStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    
    // Button should be disabled when no conditions are selected
    expect(continueButton).toBeDisabled();
    
    // Clicking disabled button should not advance step
    await act(async () => {
      await userEvent.click(continueButton);
    });

    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      // Step should remain at 1 (initial step) since button is disabled
      expect(contextState.step).toBe(1);
      expect(contextState.selectedHealthConditions).toEqual([]);
    });
  });

  it('should persist selected conditions from context', async () => {
    const initialState = {
      step: 4,
      user: null,
      selectedMembershipTier: null,
      creditCardData: null,
      selectedHealthConditions: ['heart-disease', 'diabetes'],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    
    render(<HealthConditionsStep />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    const heartDiseaseCheckbox = screen.getByLabelText(/heart disease/i);
    expect(heartDiseaseCheckbox).toBeChecked();
  });

  it('should disable other conditions when "none of the above" is selected', async () => {
    render(<HealthConditionsStep />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    const noneCheckbox = screen.getByLabelText(/none of the above/i);
    const heartDiseaseCheckbox = screen.getByLabelText(/heart disease/i);
    
    // Select "none of the above"
    await act(async () => {
      await userEvent.click(noneCheckbox);
    });
    expect(noneCheckbox).toBeChecked();
    
    // Other conditions should be disabled
    expect(heartDiseaseCheckbox).toBeDisabled();
  });

  it('should save previous selections when "none of the above" is selected', async () => {
    render(
      <>
        <HealthConditionsStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    
    const heartDiseaseCheckbox = screen.getByLabelText(/heart disease/i);
    const noneCheckbox = screen.getByLabelText(/none of the above/i);
    
    // Select some conditions first
    await act(async () => {
      await userEvent.click(heartDiseaseCheckbox);
    });
    expect(heartDiseaseCheckbox).toBeChecked();
    
    // Select "none of the above"
    await act(async () => {
      await userEvent.click(noneCheckbox);
    });
    expect(noneCheckbox).toBeChecked();
    // Previous selections should be visually checked but disabled
    expect(heartDiseaseCheckbox).toBeChecked();
    expect(heartDiseaseCheckbox).toBeDisabled();
    
    // Save to context
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await act(async () => {
      await userEvent.click(continueButton);
    });
    
    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      // Only "none" should be stored, not the previous selections
      expect(contextState.selectedHealthConditions).toEqual(['none']);
    });
  });

  it('should restore previous selections when "none of the above" is unselected', async () => {
    render(<HealthConditionsStep />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    
    const heartDiseaseCheckbox = screen.getByLabelText(/heart disease/i);
    const diabetesCheckbox = screen.getByLabelText(/diabetes \(type 1\)/i);
    const noneCheckbox = screen.getByLabelText(/none of the above/i);
    
    // Select some conditions first
    await act(async () => {
      await userEvent.click(heartDiseaseCheckbox);
    });
    await act(async () => {
      await userEvent.click(diabetesCheckbox);
    });
    expect(heartDiseaseCheckbox).toBeChecked();
    expect(diabetesCheckbox).toBeChecked();
    
    // Select "none of the above"
    await act(async () => {
      await userEvent.click(noneCheckbox);
    });
    expect(noneCheckbox).toBeChecked();
    // Previous selections should be visually checked but disabled
    expect(heartDiseaseCheckbox).toBeChecked();
    expect(diabetesCheckbox).toBeChecked();
    expect(heartDiseaseCheckbox).toBeDisabled();
    expect(diabetesCheckbox).toBeDisabled();
    
    // Unselect "none of the above"
    await act(async () => {
      await userEvent.click(noneCheckbox);
    });
    expect(noneCheckbox).not.toBeChecked();
    
    // Previous selections should be restored and enabled
    expect(heartDiseaseCheckbox).toBeChecked();
    expect(diabetesCheckbox).toBeChecked();
    expect(heartDiseaseCheckbox).not.toBeDisabled();
    expect(diabetesCheckbox).not.toBeDisabled();
  });

  it('should store "none" selection in context', async () => {
    render(
      <>
        <HealthConditionsStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    
    const noneCheckbox = screen.getByLabelText(/none of the above/i);
    await act(async () => {
      await userEvent.click(noneCheckbox);
    });
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await act(async () => {
      await userEvent.click(continueButton);
    });
    
    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      expect(contextState.selectedHealthConditions).toEqual(['none']);
    });
  });

  it('should store restored selections when continuing after unchecking "none"', async () => {
    render(
      <>
        <HealthConditionsStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    
    const heartDiseaseCheckbox = screen.getByLabelText(/heart disease/i);
    const noneCheckbox = screen.getByLabelText(/none of the above/i);
    
    // Select some conditions first
    await act(async () => {
      await userEvent.click(heartDiseaseCheckbox);
    });
    expect(heartDiseaseCheckbox).toBeChecked();
    
    // Select "none of the above"
    await act(async () => {
      await userEvent.click(noneCheckbox);
    });
    expect(noneCheckbox).toBeChecked();
    expect(heartDiseaseCheckbox).toBeChecked(); // Visually checked but disabled
    
    // Unselect "none of the above"
    await act(async () => {
      await userEvent.click(noneCheckbox);
    });
    expect(noneCheckbox).not.toBeChecked();
    expect(heartDiseaseCheckbox).toBeChecked(); // Restored and enabled
    
    // Continue - restored selections should be stored
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await act(async () => {
      await userEvent.click(continueButton);
    });
    
    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      // Restored selections should be stored, not "none"
      expect(contextState.selectedHealthConditions).toContain('heart-disease');
      expect(contextState.selectedHealthConditions).not.toContain('none');
    });
  });

  it('should disable continue button when no conditions are selected', async () => {
    render(<HealthConditionsStep />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    const continueButton = screen.getByRole('button', { name: /continue/i });
    
    // Button should be disabled when no conditions are selected
    expect(continueButton).toBeDisabled();
  });

  it('should enable continue button when a condition is selected', async () => {
    render(<HealthConditionsStep />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    const continueButton = screen.getByRole('button', { name: /continue/i });
    const heartDiseaseCheckbox = screen.getByLabelText(/heart disease/i);
    
    // Button should be disabled initially
    expect(continueButton).toBeDisabled();
    
    // Select a condition - wrap in act to handle state updates
    await act(async () => {
      await userEvent.click(heartDiseaseCheckbox);
    });
    
    // Wait for state update to complete
    await waitFor(() => {
      expect(heartDiseaseCheckbox).toBeChecked();
      expect(continueButton).not.toBeDisabled();
    });
  });

  it('should enable continue button when "none of the above" is selected', async () => {
    render(<HealthConditionsStep />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText(/health information/i)).toBeInTheDocument();
    });
    const continueButton = screen.getByRole('button', { name: /continue/i });
    const noneCheckbox = screen.getByLabelText(/none of the above/i);
    
    // Button should be disabled initially
    expect(continueButton).toBeDisabled();
    
    // Select "none of the above" - wrap in act to handle state updates
    await act(async () => {
      await userEvent.click(noneCheckbox);
    });
    
    // Wait for state update to complete
    await waitFor(() => {
      expect(noneCheckbox).toBeChecked();
      expect(continueButton).not.toBeDisabled();
    });
  });
});

