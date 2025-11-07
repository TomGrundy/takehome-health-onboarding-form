import React, { useState, FormEvent } from 'react';
import { login } from '../../assets/auth';
import { useOnboarding } from '../context/OnboardingContext';
import './LoginStep.css';

export function LoginStep() {
  const { dispatch } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
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
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your email"
          />
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

