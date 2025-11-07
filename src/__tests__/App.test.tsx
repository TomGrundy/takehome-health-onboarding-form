import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('App', () => {
  it('should render the app', () => {
    render(<App />);
    expect(screen.getByText(/gym membership onboarding/i)).toBeInTheDocument();
  });

  it('should show login step initially', () => {
    render(<App />);
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
  });
});

