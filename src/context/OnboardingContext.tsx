import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { OnboardingState, OnboardingAction } from '../types';

const STORAGE_KEY = 'onboarding_state';

const initialState: OnboardingState = {
  step: 1,
  user: null,
  selectedMembershipTier: null,
  creditCardData: null,
  selectedHealthConditions: [],
};

function loadState(): OnboardingState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
  }
  return initialState;
}

function saveState(state: OnboardingState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
}

function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_MEMBERSHIP_TIER':
      return { ...state, selectedMembershipTier: action.payload };
    case 'SET_CREDIT_CARD':
      return { ...state, creditCardData: action.payload };
    case 'SET_HEALTH_CONDITIONS':
      return { ...state, selectedHealthConditions: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface OnboardingContextType {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

