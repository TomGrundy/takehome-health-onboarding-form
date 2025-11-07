import React, { useState, FormEvent, useMemo } from 'react';
import { login } from '../../../assets/auth';
import { useOnboarding } from '../../context/OnboardingContext';
import { STORAGE_KEYS, ACTION_TYPES, STEPS, UI_STRINGS, TEXT } from '../../constants';
import './LoginStep.css';

// Email validation regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return TEXT.MESSAGES.EMAIL_REQUIRED;
  }
  if (!EMAIL_REGEX.test(email)) {
    return TEXT.MESSAGES.EMAIL_INVALID;
  }
  return null;
}

export function LoginStep() {
  const { dispatch } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Clear email error when user starts typing
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleEmailBlur = () => {
    const validationError = validateEmail(email);
    setEmailError(validationError);
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const emailValidationError = validateEmail(email);
    return !emailValidationError && password.trim().length > 0;
  }, [email, password]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    // Validate email before submission
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    setLoading(true);

    try {
      const { token, user } = await login(email, password);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      dispatch({ type: ACTION_TYPES.SET_USER, payload: user });
      dispatch({ type: ACTION_TYPES.SET_STEP, payload: STEPS.MEMBERSHIP });
    } catch (err) {
      setError(err instanceof Error ? err.message : TEXT.MESSAGES.LOGIN_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-step">
      <h2>{TEXT.HEADERS.CREATE_YOUR_ACCOUNT}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">{TEXT.LABELS.EMAIL}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            required
            disabled={loading}
            placeholder={UI_STRINGS.PLACEHOLDERS.EMAIL}
            aria-invalid={emailError ? 'true' : 'false'}
            aria-describedby={emailError ? 'email-error' : undefined}
          />
          {emailError && (
            <span id="email-error" className="field-error" role="alert">
              {emailError}
            </span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">{TEXT.LABELS.PASSWORD}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder={UI_STRINGS.PLACEHOLDERS.PASSWORD}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading || !isFormValid} className="submit-button">
          {loading ? UI_STRINGS.BUTTONS.LOGGING_IN : UI_STRINGS.BUTTONS.CONTINUE}
        </button>
      </form>
    </div>
  );
}

