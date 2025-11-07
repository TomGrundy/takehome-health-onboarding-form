import React, { useRef, useState, useEffect } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { MembershipTier } from '../types';
import membershipTiersData from '../../assets/membership-tiers.json';
import './MembershipTierStep.css';

const membershipTiers: MembershipTier[] = membershipTiersData as MembershipTier[];

export function MembershipTierStep() {
  const { state, dispatch } = useOnboarding();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleSelectTier = (tier: MembershipTier) => {
    dispatch({ type: 'SET_MEMBERSHIP_TIER', payload: tier });
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        carousel.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector('.tier-card')?.clientWidth || 320;
      const scrollAmount = cardWidth + 32; // card width + gap
      const currentScroll = carouselRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="membership-tier-step">
      <h2>Select Your Membership Tier</h2>
      <div className="tiers-container">
        <button 
          className="carousel-button carousel-button-left"
          onClick={() => scrollCarousel('left')}
          aria-label="Previous tier"
          disabled={!canScrollLeft}
        >
          <span>‹</span>
        </button>
        <div className="tiers-carousel" ref={carouselRef}>
          <div className="tiers-list">
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
                <div className="access-hours">Access Hours: {tier.accessHours}</div>
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
        <button 
          className="carousel-button carousel-button-right"
          onClick={() => scrollCarousel('right')}
          aria-label="Next tier"
          disabled={!canScrollRight}
        >
          <span>›</span>
        </button>
      </div>
    </div>
  );
}

