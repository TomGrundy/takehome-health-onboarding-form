import React from 'react';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { Header } from './components/Header';
import { LoginStep } from './components/LoginStep';
import { MembershipTierStep } from './components/MembershipTierStep';
import { CreditCardStep } from './components/CreditCardStep';
import { HealthConditionsStep } from './components/HealthConditionsStep';
import { SummaryStep } from './components/SummaryStep';
import './App.css';

function AppContent() {
  const { state } = useOnboarding();

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <LoginStep />;
      case 2:
        return <MembershipTierStep />;
      case 3:
        return <CreditCardStep />;
      case 4:
        return <HealthConditionsStep />;
      case 5:
        return <SummaryStep />;
      default:
        return <LoginStep />;
    }
  };

  return (
    <div className="app">
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

