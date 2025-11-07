import React from 'react';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { Header } from './components/shared/Header';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { LoginStep } from './components/login/LoginStep';
import { MembershipTierStep } from './components/membership/MembershipTierStep';
import { CreditCardStep } from './components/payment/CreditCardStep';
import { HealthConditionsStep } from './components/health-info/HealthConditionsStep';
import { SummaryStep } from './components/summary/SummaryStep';
import { STEPS } from './constants';
import './App.css';

function AppContent() {
  const { state, isVerifyingToken } = useOnboarding();

  const renderStep = () => {
    switch (state.step) {
      case STEPS.LOGIN:
        return <LoginStep />;
      case STEPS.MEMBERSHIP:
        return <MembershipTierStep />;
      case STEPS.PAYMENT:
        return <CreditCardStep />;
      case STEPS.HEALTH_INFO:
        return <HealthConditionsStep />;
      case STEPS.SUMMARY:
        return <SummaryStep />;
      default:
        return <LoginStep />;
    }
  };

  return (
    <div className="app">
      {isVerifyingToken && <LoadingSpinner />}
      <Header />
      <main className="app-main">{renderStep()}</main>
    </div>
  );
}

export function App() {
  return (
    <OnboardingProvider>
      <AppContent />
    </OnboardingProvider>
  );
}

