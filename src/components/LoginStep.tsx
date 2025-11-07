import React, { useState, FormEvent } from 'react';
import { login } from '../../assets/auth';
import { useOnboarding } from '../context/OnboardingContext';
import './LoginStep.css';

// Email validation regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
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
      localStorage.setItem('auth_token', token);
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_STEP', payload: 2 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-step">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            required
            disabled={loading}
            placeholder="Enter your email"
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your password"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Logging in...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}

