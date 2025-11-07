import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { CreditCardData } from '../types';
import './CreditCardStep.css';

export function CreditCardStep() {
  const { dispatch } = useOnboarding();
  const [formData, setFormData] = useState<CreditCardData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'SET_CREDIT_CARD', payload: formData });
    dispatch({ type: 'SET_STEP', payload: 4 });
  };

  return (
    <div className="credit-card-step">
      <h2>Payment Information</h2>
      <form onSubmit={handleSubmit} className="credit-card-form">
        <div className="form-group">
          <label htmlFor="cardholderName">Cardholder Name</label>
          <input
            id="cardholderName"
            name="cardholderName"
            type="text"
            value={formData.cardholderName}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            value={formData.cardNumber}
            onChange={handleChange}
            required
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="text"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              placeholder="MM/YY"
              maxLength={5}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              name="cvv"
              type="text"
              value={formData.cvv}
              onChange={handleChange}
              required
              placeholder="123"
              maxLength={3}
            />
          </div>
        </div>
        <button type="submit" className="submit-button">
          Continue
        </button>
      </form>
    </div>
  );
}

