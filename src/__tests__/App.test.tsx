import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { login } from '../../assets/auth';

jest.mock('../../assets/auth');

const mockLogin = login as jest.MockedFunction<typeof login>;

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render the app', () => {
    render(<App />);
    expect(screen.getByText(/gym membership onboarding/i)).toBeInTheDocument();
  });

  it('should show login step initially', () => {
    render(<App />);
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
  });

  it('should navigate to membership tier step after login', async () => {
    const user = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      membershipType: 'premium' as const,
      memberSince: '2024-01-01',
    };
    mockLogin.mockResolvedValue({ token: 'mock-token', user });

    render(<App />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/select your membership tier/i)).toBeInTheDocument();
    });
  });

  it('should render correct step component for each step', () => {
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
    
    render(<App />);
    expect(screen.getByText(/select your membership tier/i)).toBeInTheDocument();
  });

  it('should render payment step when step is 3', () => {
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
    
    render(<App />);
    expect(screen.getByText(/payment information/i)).toBeInTheDocument();
  });

  it('should render health conditions step when step is 4', () => {
    const initialState = {
      step: 4,
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
      creditCardData: {
        cardNumber: '1234567890123456',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
      },
      selectedHealthConditions: [],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    
    render(<App />);
    expect(screen.getByText(/health information/i)).toBeInTheDocument();
  });

  it('should render summary step when step is 5', () => {
    const initialState = {
      step: 5,
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
      creditCardData: {
        cardNumber: '1234567890123456',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
      },
      selectedHealthConditions: [],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    
    render(<App />);
    // "Welcome" may appear in multiple places, use getAllByText
    const welcomeElements = screen.getAllByText(/welcome/i);
    expect(welcomeElements.length).toBeGreaterThan(0);
    // More specific check for summary step
    expect(screen.getByText(/your membership qr code/i)).toBeInTheDocument();
  });

  it('should default to login step for invalid step numbers', () => {
    const initialState = {
      step: 99,
      user: null,
      selectedMembershipTier: null,
      creditCardData: null,
      selectedHealthConditions: [],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(initialState));
    
    render(<App />);
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
  });
});

