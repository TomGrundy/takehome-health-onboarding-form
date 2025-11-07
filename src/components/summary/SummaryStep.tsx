import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { HealthCondition } from '../../types';
import healthConditionsData from '../../../assets/health-conditions.json';
import { UI_STRINGS, QR_CODE } from '../../constants';
import './SummaryStep.css';

const healthConditions: HealthCondition[] = healthConditionsData as HealthCondition[];
const conditionMap = new Map(healthConditions.map((c) => [c.id, c.name]));

// Simple mock QR code component
function MockQRCode({ data }: { data: string }) {
  const size = QR_CODE.SIZE;
  const cellSize = QR_CODE.CELL_SIZE;
  const cells = size / cellSize;

  // Generate a simple pattern based on data hash
  const hash = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pattern: boolean[][] = [];
  for (let i = 0; i < cells; i++) {
    pattern[i] = [];
    for (let j = 0; j < cells; j++) {
      pattern[i][j] = (hash + i * cells + j) % 3 === 0;
    }
  }

  return (
    <div className="qr-code">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {pattern.map((row, i) =>
          row.map((filled, j) => (
            <rect
              key={`${i}-${j}`}
              x={j * cellSize}
              y={i * cellSize}
              width={cellSize}
              height={cellSize}
              fill={filled ? '#000' : '#fff'}
            />
          ))
        )}
      </svg>
    </div>
  );
}

export function SummaryStep() {
  const { state } = useOnboarding();

  const qrData = JSON.stringify({
    userId: state.user?.id,
    membershipTier: state.selectedMembershipTier?.id,
    memberSince: new Date().toISOString(),
  });

  const selectedConditionNames = state.selectedHealthConditions
    .map((id) => conditionMap.get(id) || id)
    .filter((name) => name !== UI_STRINGS.LABELS.NONE_OF_THE_ABOVE);

  return (
    <div className="summary-step">
      <h2>Welcome! Your Membership is Ready</h2>
      <div className="summary-content">
        <div className="qr-section">
          <h3>Your Membership QR Code</h3>
          <p className="qr-description">
            Scan this QR code at the gym to access facilities
          </p>
          <MockQRCode data={qrData} />
        </div>
        <div className="details-section">
          <div className="detail-card">
            <h3>Member Information</h3>
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{state.user?.name || UI_STRINGS.LABELS.N_A}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{state.user?.email || UI_STRINGS.LABELS.N_A}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Member Since:</span>
              <span className="detail-value">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="detail-card">
            <h3>Membership Plan</h3>
            <div className="detail-item">
              <span className="detail-label">Tier:</span>
              <span className="detail-value">
                {state.selectedMembershipTier?.name || UI_STRINGS.LABELS.N_A}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Price:</span>
              <span className="detail-value">
                ${state.selectedMembershipTier?.price.toFixed(2) || '0.00'}/
                {state.selectedMembershipTier?.billingPeriod || 'month'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Access Hours:</span>
              <span className="detail-value">
                {state.selectedMembershipTier?.accessHours || UI_STRINGS.LABELS.N_A}
              </span>
            </div>
          </div>
          {selectedConditionNames.length > 0 && (
            <div className="detail-card">
              <h3>Health Conditions</h3>
              <ul className="conditions-summary">
                {selectedConditionNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

