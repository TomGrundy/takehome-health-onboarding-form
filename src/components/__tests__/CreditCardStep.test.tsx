import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreditCardStep } from '../CreditCardStep';
import { OnboardingProvider } from '../../context/OnboardingContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

describe('CreditCardStep', () => {
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
    await userEvent.type(cardNumberInput, '1234abcd5678');
    expect(cardNumberInput).toHaveValue('12345678');
  });

  it('should format expiry date input', async () => {
    render(<CreditCardStep />, { wrapper });
    const expiryInput = screen.getByLabelText(/expiry date/i);
    await userEvent.type(expiryInput, '1225');
    expect(expiryInput).toHaveValue('12/25');
  });

  it('should limit CVV to 3 digits', async () => {
    render(<CreditCardStep />, { wrapper });
    const cvvInput = screen.getByLabelText(/cvv/i);
    await userEvent.type(cvvInput, '12345');
    expect(cvvInput).toHaveValue('123');
  });

  it('should submit form with valid data', async () => {
    render(<CreditCardStep />, { wrapper });
    const cardholderInput = screen.getByLabelText(/cardholder name/i);
    const cardNumberInput = screen.getByLabelText(/card number/i);
    const expiryInput = screen.getByLabelText(/expiry date/i);
    const cvvInput = screen.getByLabelText(/cvv/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await userEvent.type(cardholderInput, 'John Doe');
    await userEvent.type(cardNumberInput, '1234567890123456');
    await userEvent.type(expiryInput, '1225');
    await userEvent.type(cvvInput, '123');
    await userEvent.click(submitButton);

    // Form should submit and advance to next step
  });
});

