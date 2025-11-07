import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { CreditCardStep } from './CreditCardStep';
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
        creditCardData: state.creditCardData,
      })}
    </div>
  );
}

describe('CreditCardStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render credit card form', () => {
    render(<CreditCardStep />, { wrapper });
    expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
  });

  it('should format card number input', async () => {
    render(<CreditCardStep />, { wrapper });
    const cardNumberInput = screen.getByLabelText(/card number/i);
    await act(async () => {
      await userEvent.type(cardNumberInput, '1234abcd5678');
    });
    expect(cardNumberInput).toHaveValue('1234 5678');
  });

  it('should limit card number to 16 digits', async () => {
    render(<CreditCardStep />, { wrapper });
    const cardNumberInput = screen.getByLabelText(/card number/i);
    await act(async () => {
      await userEvent.type(cardNumberInput, '12345678901234567890');
    });
    expect(cardNumberInput).toHaveValue('1234 5678 9012 3456');
  });

  it('should format expiry date input', async () => {
    render(<CreditCardStep />, { wrapper });
    const expiryInput = screen.getByLabelText(/expiry date/i);
    await act(async () => {
      await userEvent.type(expiryInput, '1225');
    });
    expect(expiryInput).toHaveValue('12/25');
  });

  it('should limit CVV to 3 digits', async () => {
    render(<CreditCardStep />, { wrapper });
    const cvvInput = screen.getByLabelText(/cvv/i);
    await act(async () => {
      await userEvent.type(cvvInput, '12345');
    });
    expect(cvvInput).toHaveValue('123');
  });

  it('should submit form with valid data and save to context', async () => {
    // Set up initial state to step 3 (CreditCardStep)
    const initialState = {
      step: 3,
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
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

    render(
      <>
        <CreditCardStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    const cardholderInput = screen.getByLabelText(/cardholder name/i);
    const cardNumberInput = screen.getByLabelText(/card number/i);
    const expiryInput = screen.getByLabelText(/expiry date/i);
    const cvvInput = screen.getByLabelText(/cvv/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await act(async () => {
      await userEvent.type(cardholderInput, 'John Doe');
      await userEvent.type(cardNumberInput, '1234567890123456');
      await userEvent.type(expiryInput, '1225');
      await userEvent.type(cvvInput, '123');
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      expect(contextState.step).toBe(4);
      expect(contextState.creditCardData).toEqual({
        cardholderName: 'John Doe',
        cardNumber: '1234567890123456',
        expiryDate: '12/25',
        cvv: '123',
      });
    });
  });

  it('should not submit form with empty required fields', async () => {
    // Set up initial state to step 3 (CreditCardStep)
    const initialState = {
      step: 3,
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
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

    render(
      <>
        <CreditCardStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await act(async () => {
      await userEvent.click(submitButton);
    });

    // HTML5 validation should prevent submission
    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      // Step should remain at 3 (CreditCardStep is step 3)
      expect(contextState.step).toBe(3);
      expect(contextState.creditCardData).toBeNull();
    });

    // Verify form validation attributes
    expect(screen.getByLabelText(/cardholder name/i)).toBeRequired();
    expect(screen.getByLabelText(/card number/i)).toBeRequired();
    expect(screen.getByLabelText(/expiry date/i)).toBeRequired();
    expect(screen.getByLabelText(/cvv/i)).toBeRequired();
  });

  it('should disable continue button when form is invalid', async () => {
    render(<CreditCardStep />, { wrapper });
    const submitButton = screen.getByRole('button', { name: /continue/i });
    
    // Button should be disabled when form is empty
    expect(submitButton).toBeDisabled();
    
    // Button should be disabled with partial information
    const cardholderInput = screen.getByLabelText(/cardholder name/i);
    await act(async () => {
      await userEvent.type(cardholderInput, 'John Doe');
    });
    expect(submitButton).toBeDisabled();
    
    // Button should be disabled with incomplete card number
    const cardNumberInput = screen.getByLabelText(/card number/i);
    await act(async () => {
      await userEvent.type(cardNumberInput, '1234');
    });
    expect(submitButton).toBeDisabled();
    
    // Button should be enabled when all fields are valid
    await act(async () => {
      await userEvent.clear(cardNumberInput);
      await userEvent.type(cardNumberInput, '1234567890123456');
      await userEvent.type(screen.getByLabelText(/expiry date/i), '1225');
      await userEvent.type(screen.getByLabelText(/cvv/i), '123');
    });
    expect(submitButton).not.toBeDisabled();
  });
});

