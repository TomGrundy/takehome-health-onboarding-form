import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { logout } from '../../assets/auth';
import './Header.css';

export function Header() {
  const { state, dispatch } = useOnboarding();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('onboarding_state');
    dispatch({ type: 'RESET' });
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  const stepNames = [
    'Login',
    'Membership',
    'Payment',
    'Health Info',
    'Summary',
  ];

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">Gym Membership Onboarding</h1>
        {state.user && (
          <div className="header-actions">
            <span className="user-info">
              Welcome, {state.user.name}
            </span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
      {state.user && (
        <div className="step-indicator">
          {stepNames.map((name, index) => (
            <div
              key={index}
              className={`step-item ${index + 1 === state.step ? 'active' : ''} ${
                index + 1 < state.step ? 'completed' : ''
              }`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-name">{name}</div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

