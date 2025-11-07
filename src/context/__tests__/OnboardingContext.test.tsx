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
  });

  it('should update step', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_STEP', payload: 2 });
    });
    expect(result.current.state.step).toBe(2);
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

  it('should reset state', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper });
    act(() => {
      result.current.dispatch({ type: 'SET_STEP', payload: 5 });
      result.current.dispatch({ type: 'RESET' });
    });
    expect(result.current.state.step).toBe(1);
  });
});

