import React, { useRef, useState, useEffect } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { MembershipTier } from '../../types';
import membershipTiersData from '../../../assets/membership-tiers.json';
import { ACTION_TYPES, STEPS, UI_STRINGS, CAROUSEL, TEXT } from '../../constants';
import './MembershipTierStep.css';

const membershipTiers: MembershipTier[] = membershipTiersData as MembershipTier[];

export function MembershipTierStep() {
  const { state, dispatch } = useOnboarding();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleSelectTier = (tier: MembershipTier) => {
    dispatch({ type: ACTION_TYPES.SET_MEMBERSHIP_TIER, payload: tier });
    dispatch({ type: ACTION_TYPES.SET_STEP, payload: STEPS.PAYMENT });
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
      const cardWidth = carouselRef.current.querySelector('.tier-card')?.clientWidth || CAROUSEL.DEFAULT_CARD_WIDTH;
      const scrollAmount = cardWidth + CAROUSEL.CARD_GAP; // card width + gap
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
      <h2>{TEXT.HEADERS.SELECT_YOUR_MEMBERSHIP_TIER}</h2>
      <div className="tiers-container">
        <button 
          className="carousel-button carousel-button-left"
          onClick={() => scrollCarousel('left')}
          aria-label={TEXT.ARIA_LABELS.PREVIOUS_TIER}
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
                {tier.popular && <div className="popular-badge">{UI_STRINGS.LABELS.MOST_POPULAR}</div>}
                <h3>{tier.name}</h3>
                <div className="price">
                  ${tier.price.toFixed(2)}
                  <span className="period">/{tier.billingPeriod}</span>
                </div>
                <div className="access-hours">{TEXT.LABELS.ACCESS_HOURS_PREFIX}{tier.accessHours}</div>
                <ul className="features-list">
                  {tier.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectTier(tier)}
                  className="select-button"
                >
                  {UI_STRINGS.BUTTONS.SELECT_PLAN}
                </button>
              </div>
            ))}
          </div>
        </div>
        <button 
          className="carousel-button carousel-button-right"
          onClick={() => scrollCarousel('right')}
          aria-label={TEXT.ARIA_LABELS.NEXT_TIER}
          disabled={!canScrollRight}
        >
          <span>›</span>
        </button>
      </div>
    </div>
  );
}

