import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { CreditCardData } from '../../types';
import { ACTION_TYPES, STEPS, UI_STRINGS, CREDIT_CARD_LIMITS, TEXT } from '../../constants';
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
      // Remove all non-digits and limit to 16 digits
      const digits = value.replace(/\D/g, '').slice(0, CREDIT_CARD_LIMITS.CARD_NUMBER_LENGTH);
      // Add space every 4 digits
      formattedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, CREDIT_CARD_LIMITS.EXPIRY_DATE_LENGTH);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, CREDIT_CARD_LIMITS.CVV_LENGTH);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Strip spaces from card number before storing
    const cardDataToStore = {
      ...formData,
      cardNumber: formData.cardNumber.replace(/\s/g, ''),
    };
    dispatch({ type: ACTION_TYPES.SET_CREDIT_CARD, payload: cardDataToStore });
    dispatch({ type: ACTION_TYPES.SET_STEP, payload: STEPS.HEALTH_INFO });
  };

  // Validate credit card form
  const cardNumberDigits = formData.cardNumber.replace(/\D/g, '');
  const expiryDateDigits = formData.expiryDate.replace(/\D/g, '');
  
  const isFormValid =
    formData.cardholderName.trim().length > 0 &&
    cardNumberDigits.length === CREDIT_CARD_LIMITS.CARD_NUMBER_LENGTH &&
    expiryDateDigits.length === CREDIT_CARD_LIMITS.EXPIRY_DATE_LENGTH &&
    formData.expiryDate.length === CREDIT_CARD_LIMITS.EXPIRY_DATE_DISPLAY_LENGTH &&
    formData.cvv.length === CREDIT_CARD_LIMITS.CVV_LENGTH;

  return (
    <div className="credit-card-step">
      <h2>{TEXT.HEADERS.PAYMENT_INFORMATION}</h2>
      <form onSubmit={handleSubmit} className="credit-card-form">
        <div className="form-group">
          <label htmlFor="cardholderName">{TEXT.LABELS.CARDHOLDER_NAME}</label>
          <input
            id="cardholderName"
            name="cardholderName"
            type="text"
            value={formData.cardholderName}
            onChange={handleChange}
            required
            placeholder={UI_STRINGS.PLACEHOLDERS.CARDHOLDER_NAME}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">{TEXT.LABELS.CARD_NUMBER}</label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            value={formData.cardNumber}
            onChange={handleChange}
            required
            placeholder={UI_STRINGS.PLACEHOLDERS.CARD_NUMBER}
            maxLength={CREDIT_CARD_LIMITS.CARD_NUMBER_DISPLAY_LENGTH}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">{TEXT.LABELS.EXPIRY_DATE}</label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="text"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              placeholder={UI_STRINGS.PLACEHOLDERS.EXPIRY_DATE}
              maxLength={CREDIT_CARD_LIMITS.EXPIRY_DATE_DISPLAY_LENGTH}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">{TEXT.LABELS.CVV}</label>
            <input
              id="cvv"
              name="cvv"
              type="text"
              value={formData.cvv}
              onChange={handleChange}
              required
              placeholder={UI_STRINGS.PLACEHOLDERS.CVV}
              maxLength={CREDIT_CARD_LIMITS.CVV_LENGTH}
            />
          </div>
        </div>
        <button type="submit" className="submit-button" disabled={!isFormValid}>
          {UI_STRINGS.BUTTONS.CONTINUE}
        </button>
      </form>
    </div>
  );
}

