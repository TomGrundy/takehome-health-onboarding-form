import { renderHook, act } from '@testing-library/react';
import { OnboardingProvider, useOnboarding } from '../OnboardingContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <OnboardingProvider>{children}</OnboardingProvider>
);

describe('OnboardingContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    expect(result.current.state.step).toBe(1);
    expect(result.current.state.user).toBeNull();
    expect(result.current.state.selectedMembershipTier).toBeNull();
    expect(result.current.state.creditCardData).toBeNull();
    expect(result.current.state.selectedHealthConditions).toEqual([]);
  });

  it('should update step', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_STEP', payload: 2 });
    });
    expect(result.current.state.step).toBe(2);
  });

  it('should set user', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    const user = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      membershipType: 'premium' as const,
      memberSince: '2024-01-01',
    };
    act(() => {
      result.current.dispatch({ type: 'SET_USER', payload: user });
    });
    expect(result.current.state.user).toEqual(user);
  });

  it('should set membership tier', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    const tier = {
      id: 'premium',
      name: 'Premium Membership',
      price: 49.99,
      billingPeriod: 'month' as const,
      features: ['Access to gym floor'],
      accessHours: '24/7',
    };
    act(() => {
      result.current.dispatch({ type: 'SET_MEMBERSHIP_TIER', payload: tier });
    });
    expect(result.current.state.selectedMembershipTier).toEqual(tier);
  });

  it('should set credit card data', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    const creditCardData = {
      cardNumber: '1234567890123456',
      expiryDate: '12/25',
      cvv: '123',
      cardholderName: 'John Doe',
    };
    act(() => {
      result.current.dispatch({ type: 'SET_CREDIT_CARD', payload: creditCardData });
    });
    expect(result.current.state.creditCardData).toEqual(creditCardData);
  });

  it('should set health conditions', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    const conditions = ['heart-disease', 'diabetes'];
    act(() => {
      result.current.dispatch({ type: 'SET_HEALTH_CONDITIONS', payload: conditions });
    });
    expect(result.current.state.selectedHealthConditions).toEqual(conditions);
  });

  it('should persist state to localStorage', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_STEP', payload: 3 });
    });
    const stored = localStorage.getItem('onboarding_state');
    expect(stored).toBeTruthy();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.step).toBe(3);
    }
  });

  it('should load state from localStorage', () => {
    const savedState = {
      step: 2,
      user: null,
      selectedMembershipTier: null,
      creditCardData: null,
      selectedHealthConditions: [],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(savedState));
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    expect(result.current.state.step).toBe(2);
  });

  it('should load complete state from localStorage', () => {
    const savedState = {
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
      creditCardData: {
        cardNumber: '1234567890123456',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
      },
      selectedHealthConditions: ['heart-disease'],
    };
    localStorage.setItem('onboarding_state', JSON.stringify(savedState));
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    expect(result.current.state.step).toBe(3);
    expect(result.current.state.user).toEqual(savedState.user);
    expect(result.current.state.selectedMembershipTier).toEqual(savedState.selectedMembershipTier);
    expect(result.current.state.creditCardData).toEqual(savedState.creditCardData);
    expect(result.current.state.selectedHealthConditions).toEqual(savedState.selectedHealthConditions);
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_STEP', payload: 5 });
      result.current.dispatch({ type: 'SET_USER', payload: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        membershipType: 'premium' as const,
        memberSince: '2024-01-01',
      } });
      result.current.dispatch({ type: 'RESET' });
    });
    expect(result.current.state.step).toBe(1);
    expect(result.current.state.user).toBeNull();
    expect(result.current.state.selectedMembershipTier).toBeNull();
    expect(result.current.state.creditCardData).toBeNull();
    expect(result.current.state.selectedHealthConditions).toEqual([]);
  });

  it('should handle invalid localStorage data gracefully', () => {
    localStorage.setItem('onboarding_state', 'invalid json');
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    // Should fall back to initial state
    expect(result.current.state.step).toBe(1);
    expect(result.current.state.user).toBeNull();
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = jest.fn(() => {
      throw new Error('Storage quota exceeded');
    });

    const { result } = renderHook(() => useOnboarding(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_STEP', payload: 2 });
    });
    // Should still update state even if localStorage fails
    expect(result.current.state.step).toBe(2);

    localStorage.setItem = originalSetItem;
  });
});

