import { User } from '../../assets/auth';

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'month' | 'year';
  features: string[];
  accessHours: string;
  popular?: boolean;
}

export interface HealthCondition {
  id: string;
  name: string;
  category: string;
  requiresMedicalClearance: boolean;
}

export interface CreditCardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface OnboardingState {
  step: number;
  user: User | null;
  selectedMembershipTier: MembershipTier | null;
  creditCardData: CreditCardData | null;
  selectedHealthConditions: string[];
}

export type OnboardingAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_MEMBERSHIP_TIER'; payload: MembershipTier | null }
  | { type: 'SET_CREDIT_CARD'; payload: CreditCardData | null }
  | { type: 'SET_HEALTH_CONDITIONS'; payload: string[] }
  | { type: 'RESET' };

