import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { HealthCondition } from '../types';
import healthConditionsData from '../../assets/health-conditions.json';
import './HealthConditionsStep.css';

const healthConditions: HealthCondition[] = healthConditionsData as HealthCondition[];
const NONE_CONDITION_ID = 'none';

export function HealthConditionsStep() {
  const { state, dispatch } = useOnboarding();
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    state.selectedHealthConditions || []
  );
  const [previousSelections, setPreviousSelections] = useState<string[]>([]);

  useEffect(() => {
    const savedConditions = state.selectedHealthConditions || [];
    setSelectedConditions(savedConditions);
    // If "none" is selected, we don't restore previous selections
    // Otherwise, clear previous selections when loading from context
    if (!savedConditions.includes(NONE_CONDITION_ID)) {
      setPreviousSelections([]);
    }
  }, [state.selectedHealthConditions]);

  const handleToggleCondition = (conditionId: string) => {
    setSelectedConditions((prev) => {
      if (conditionId === NONE_CONDITION_ID) {
        // Toggling "none of the above"
        if (prev.includes(NONE_CONDITION_ID)) {
          // Unselecting "none" - restore previous selections
          return previousSelections;
        } else {
          // Selecting "none" - save current selections and clear them
          const currentSelections = prev.filter((id) => id !== NONE_CONDITION_ID);
          setPreviousSelections(currentSelections);
          return [NONE_CONDITION_ID];
        }
      } else {
        // Toggling a regular condition
        if (prev.includes(NONE_CONDITION_ID)) {
          // If "none" is selected, unselect it, restore previous selections, and toggle this condition
          const restored = previousSelections.includes(conditionId)
            ? previousSelections.filter((id) => id !== conditionId)
            : [...previousSelections, conditionId];
          return restored;
        } else {
          // Normal toggle behavior
          if (prev.includes(conditionId)) {
            return prev.filter((id) => id !== conditionId);
          } else {
            return [...prev, conditionId];
          }
        }
      }
    });
  };

  const handleContinue = () => {
    dispatch({ type: 'SET_HEALTH_CONDITIONS', payload: selectedConditions });
    dispatch({ type: 'SET_STEP', payload: 5 });
  };

  const groupedConditions = healthConditions.reduce(
    (acc, condition) => {
      const category = condition.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(condition);
      return acc;
    },
    {} as Record<string, HealthCondition[]>
  );

  return (
    <div className="health-conditions-step">
      <h2>Health Information</h2>
      <p className="subtitle">
        Please select any health conditions that apply to you. This information
        helps us provide appropriate guidance and ensure your safety.
      </p>
      <div className="conditions-container">
        {Object.entries(groupedConditions).map(([category, conditions]) => (
          <div key={category} className="category-group">
            <h3 className="category-title">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            <div className="conditions-list">
              {conditions.map((condition) => {
                const isNoneSelected = selectedConditions.includes(NONE_CONDITION_ID);
                const isNoneCondition = condition.id === NONE_CONDITION_ID;
                const isDisabled = isNoneSelected && !isNoneCondition;
                
                return (
                  <label
                    key={condition.id}
                    className={`condition-item ${
                      selectedConditions.includes(condition.id) ? 'selected' : ''
                    } ${condition.requiresMedicalClearance ? 'requires-clearance' : ''} ${
                      isDisabled ? 'disabled' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(condition.id)}
                      onChange={() => handleToggleCondition(condition.id)}
                      disabled={isDisabled}
                    />
                    <span className="condition-name">{condition.name}</span>
                    {condition.requiresMedicalClearance && (
                      <span className="clearance-badge">Requires Medical Clearance</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleContinue} className="continue-button">
        Continue
      </button>
    </div>
  );
}

