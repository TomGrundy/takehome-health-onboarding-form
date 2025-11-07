/**
 * Application-wide constants
 * 
 * This file contains all constants that are used across multiple components
 * to avoid duplication and ensure consistency.
 */

// Action Types
export const ACTION_TYPES = {
  SET_STEP: 'SET_STEP',
  SET_USER: 'SET_USER',
  SET_MEMBERSHIP_TIER: 'SET_MEMBERSHIP_TIER',
  SET_CREDIT_CARD: 'SET_CREDIT_CARD',
  SET_HEALTH_CONDITIONS: 'SET_HEALTH_CONDITIONS',
  RESET: 'RESET',
} as const;

// Step Numbers
export const STEPS = {
  LOGIN: 1,
  MEMBERSHIP: 2,
  PAYMENT: 3,
  HEALTH_INFO: 4,
  SUMMARY: 5,
} as const;

// Step Names (for display in header)
export const STEP_NAMES = [
  'Login',
  'Membership',
  'Payment',
  'Health Info',
  'Summary',
] as const;

// LocalStorage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  ONBOARDING_STATE: 'onboarding_state',
} as const;

// UI Strings
export const UI_STRINGS = {
  BUTTONS: {
    CONTINUE: 'Continue',
    SELECT_PLAN: 'Select Plan',
    LOGGING_IN: 'Logging in...',
    LOGOUT: 'Logout',
  },
  LABELS: {
    MOST_POPULAR: 'Most Popular',
    NONE_OF_THE_ABOVE: 'None of the above',
    REQUIRES_MEDICAL_CLEARANCE: 'Requires Medical Clearance',
    N_A: 'N/A',
  },
  PLACEHOLDERS: {
    EMAIL: 'Enter your email',
    PASSWORD: 'Enter your password',
    CARDHOLDER_NAME: 'John Doe',
    CARD_NUMBER: '1234 5678 9012 3456',
    EXPIRY_DATE: 'MM/YY',
    CVV: '123',
  },
} as const;

// Credit Card Validation Constants
export const CREDIT_CARD_LIMITS = {
  CARD_NUMBER_LENGTH: 16,
  CARD_NUMBER_DISPLAY_LENGTH: 19,
  CVV_LENGTH: 3,
  EXPIRY_DATE_LENGTH: 4,
  EXPIRY_DATE_DISPLAY_LENGTH: 5,
} as const;

// Carousel Constants
export const CAROUSEL = {
  DEFAULT_CARD_WIDTH: 320,
  CARD_GAP: 32,
} as const;

// QR Code Constants
export const QR_CODE = {
  SIZE: 200,
  CELL_SIZE: 8,
} as const;

// Health Conditions Constants
export const HEALTH_CONDITIONS = {
  NONE_CONDITION_ID: 'none',
  DEFAULT_CATEGORY: 'other',
} as const;

