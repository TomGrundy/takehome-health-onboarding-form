import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginStep } from '../LoginStep';
import { OnboardingProvider } from '../../context/OnboardingContext';
import { login } from '../../../../assets/auth';

jest.mock('../../../../assets/auth');

const mockLogin = login as jest.MockedFunction<typeof login>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

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

  it('should handle successful login', async () => {
    const user = { id: '123', email: 'test@example.com', name: 'Test User', membershipType: 'premium' as const, memberSince: '2024-01-01' };
    mockLogin.mockResolvedValue({ token: 'mock-token', user });

    render(<LoginStep />, { wrapper });
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
  });

  it('should display error on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));

    render(<LoginStep />, { wrapper });
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrong');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});

