import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { MembershipTier } from '../types';
import membershipTiersData from '../../assets/membership-tiers.json';
import './MembershipTierStep.css';

const membershipTiers: MembershipTier[] = membershipTiersData as MembershipTier[];

export function MembershipTierStep() {
  const { state, dispatch } = useOnboarding();

  const handleSelectTier = (tier: MembershipTier) => {
    dispatch({ type: 'SET_MEMBERSHIP_TIER', payload: tier });
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  return (
    <div className="membership-tier-step">
      <h2>Select Your Membership Tier</h2>
      <div className="tiers-grid">
        {membershipTiers.map((tier) => (
          <div
            key={tier.id}
            className={`tier-card ${tier.popular ? 'popular' : ''} ${
              state.selectedMembershipTier?.id === tier.id ? 'selected' : ''
            }`}
          >
            {tier.popular && <div className="popular-badge">Most Popular</div>}
            <h3>{tier.name}</h3>
            <div className="price">
              ${tier.price.toFixed(2)}
              <span className="period">/{tier.billingPeriod}</span>
            </div>
            <div className="access-hours">{tier.accessHours}</div>
            <ul className="features-list">
              {tier.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectTier(tier)}
              className="select-button"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

