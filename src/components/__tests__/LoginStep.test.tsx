import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { LoginStep } from '../LoginStep';
import { OnboardingProvider, useOnboarding } from '../../context/OnboardingContext';
import { login } from '../../../assets/auth';

jest.mock('../../../assets/auth');

const mockLogin = login as jest.MockedFunction<typeof login>;

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
        user: state.user ? { id: state.user.id, email: state.user.email, name: state.user.name } : null,
      })}
    </div>
  );
}

describe('LoginStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render login form', () => {
    render(<LoginStep />, { wrapper });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('should handle successful login and update context', async () => {
    const user = { id: '123', email: 'test@example.com', name: 'Test User', membershipType: 'premium' as const, memberSince: '2024-01-01' };
    mockLogin.mockResolvedValue({ token: 'mock-token', user });

    render(
      <>
        <LoginStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    expect(localStorage.getItem('auth_token')).toBe('mock-token');

    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      expect(contextState.step).toBe(2);
      expect(contextState.user).toEqual({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });

  it('should show loading state during login', async () => {
    const user = { id: '123', email: 'test@example.com', name: 'Test User', membershipType: 'premium' as const, memberSince: '2024-01-01' };
    let resolveLogin: (value: { token: string; user: typeof user }) => void;
    const loginPromise = new Promise<{ token: string; user: typeof user }>((resolve) => {
      resolveLogin = resolve;
    });
    mockLogin.mockReturnValue(loginPromise);

    render(<LoginStep />, { wrapper });
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/logging in.../i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
    });

    resolveLogin!({ token: 'mock-token', user });
    await waitFor(() => {
      expect(screen.queryByText(/logging in.../i)).not.toBeInTheDocument();
    });
  });

  it('should display error on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <>
        <LoginStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrong');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    // Verify step did not advance
    await waitFor(() => {
      const contextState = JSON.parse(
        screen.getByTestId('context-state').textContent || '{}'
      );
      expect(contextState.step).toBe(1);
      expect(contextState.user).toBeNull();
    });
  });

  it('should not submit form with empty fields', async () => {
    render(
      <>
        <LoginStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await userEvent.click(submitButton);

    // HTML5 validation should prevent submission
    // Note: In a real browser, the form would not submit, but in jsdom
    // the submit event still fires. We verify that login was not called.
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    }, { timeout: 100 });
  });

  it('should validate email format on blur', async () => {
    render(<LoginStep />, { wrapper });
    const emailInput = screen.getByLabelText(/email/i);

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab(); // Triggers blur

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('should show error for empty email on blur', async () => {
    render(<LoginStep />, { wrapper });
    const emailInput = screen.getByLabelText(/email/i);

    await userEvent.click(emailInput);
    await userEvent.tab(); // Triggers blur with empty field

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('should clear email error when user starts typing', async () => {
    render(<LoginStep />, { wrapper });
    const emailInput = screen.getByLabelText(/email/i);

    // Trigger validation error
    await userEvent.type(emailInput, 'invalid');
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    // Start typing again - error should clear
    await userEvent.type(emailInput, '@example.com');

    await waitFor(() => {
      expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
    });
  });

  it('should not submit form with invalid email', async () => {
    render(
      <>
        <LoginStep />
        <TestContextReader />
      </>,
      { wrapper }
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  it('should accept valid email formats', async () => {
    render(<LoginStep />, { wrapper });
    const emailInput = screen.getByLabelText(/email/i);

    const validEmails = [
      'test@example.com',
      'user.name@example.co.uk',
      'user+tag@example.com',
      'user123@example-domain.com',
    ];

    for (const validEmail of validEmails) {
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, validEmail);
      await userEvent.tab();

      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
      });
    }
  });
});

