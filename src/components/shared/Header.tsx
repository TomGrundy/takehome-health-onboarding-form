import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { logout } from '../../../assets/auth';
import { STORAGE_KEYS, ACTION_TYPES, STEPS, STEP_NAMES, UI_STRINGS, TEXT } from '../../constants';
import './Header.css';

export function Header() {
  const { state, dispatch } = useOnboarding();

  const handleLogout = () => {
    logout();
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_STATE);
    dispatch({ type: ACTION_TYPES.RESET });
    dispatch({ type: ACTION_TYPES.SET_STEP, payload: STEPS.LOGIN });
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">{TEXT.HEADERS.GYM_MEMBERSHIP_ONBOARDING}</h1>
        {state.user && (
          <div className="header-actions">
            <span className="user-info">
              {TEXT.MESSAGES.WELCOME_USER.replace('{name}', state.user.name)}
            </span>
            <button onClick={handleLogout} className="logout-button">
              {UI_STRINGS.BUTTONS.LOGOUT}
            </button>
          </div>
        )}
      </div>
      {state.user && (
        <div className="step-indicator">
          {STEP_NAMES.map((name, index) => (
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

