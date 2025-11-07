import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { OnboardingState, OnboardingAction } from '../types';
import { STORAGE_KEYS, ACTION_TYPES, STEPS } from '../constants';
import { isAuthenticated, verifyToken } from '../../assets/auth';

const STORAGE_KEY = STORAGE_KEYS.ONBOARDING_STATE;

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
    case ACTION_TYPES.SET_STEP:
      return { ...state, step: action.payload };
    case ACTION_TYPES.SET_USER:
      return { ...state, user: action.payload };
    case ACTION_TYPES.SET_MEMBERSHIP_TIER:
      return { ...state, selectedMembershipTier: action.payload };
    case ACTION_TYPES.SET_CREDIT_CARD:
      return { ...state, creditCardData: action.payload };
    case ACTION_TYPES.SET_HEALTH_CONDITIONS:
      return { ...state, selectedHealthConditions: action.payload };
    case ACTION_TYPES.RESET:
      return initialState;
    default:
      return state;
  }
}

interface OnboardingContextType {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  isVerifyingToken: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, loadState());
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);

  // Verify token on page load if user is not logged in
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token && !isAuthenticated()) {
        setIsVerifyingToken(true);
        try {
          await verifyToken(token);
        } catch (error) {
          // Token is invalid, clear localStorage and reset to first step
          localStorage.clear();
          dispatch({ type: ACTION_TYPES.RESET });
          dispatch({ type: ACTION_TYPES.SET_STEP, payload: STEPS.LOGIN });
        } finally {
          setIsVerifyingToken(false);
        }
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <OnboardingContext.Provider value={{ state, dispatch, isVerifyingToken }}>
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

