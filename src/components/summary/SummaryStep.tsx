import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { HealthCondition } from '../../types';
import healthConditionsData from '../../../assets/health-conditions.json';
import { UI_STRINGS, QR_CODE, TEXT } from '../../constants';
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
              fill={filled ? '#000000' : '#ffffff'}
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
      <h2>{TEXT.HEADERS.WELCOME_MEMBERSHIP_READY}</h2>
      <div className="summary-content">
        <div className="qr-section">
          <h3>{TEXT.HEADERS.YOUR_MEMBERSHIP_QR_CODE}</h3>
          <p className="qr-description">
            {TEXT.MESSAGES.QR_CODE_DESCRIPTION}
          </p>
          <MockQRCode data={qrData} />
        </div>
        <div className="details-section">
          <div className="detail-card">
            <h3>{TEXT.HEADERS.MEMBER_INFORMATION}</h3>
            <div className="detail-item">
              <span className="detail-label">{TEXT.LABELS.NAME}</span>
              <span className="detail-value">{state.user?.name || UI_STRINGS.LABELS.N_A}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{TEXT.LABELS.EMAIL_LABEL}</span>
              <span className="detail-value">{state.user?.email || UI_STRINGS.LABELS.N_A}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{TEXT.LABELS.MEMBER_SINCE}</span>
              <span className="detail-value">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="detail-card">
            <h3>{TEXT.HEADERS.MEMBERSHIP_PLAN}</h3>
            <div className="detail-item">
              <span className="detail-label">{TEXT.LABELS.TIER}</span>
              <span className="detail-value">
                {state.selectedMembershipTier?.name || UI_STRINGS.LABELS.N_A}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{TEXT.LABELS.PRICE}</span>
              <span className="detail-value">
                ${state.selectedMembershipTier?.price.toFixed(2) || '0.00'}/
                {state.selectedMembershipTier?.billingPeriod || TEXT.MESSAGES.MONTH}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{TEXT.LABELS.ACCESS_HOURS}</span>
              <span className="detail-value">
                {state.selectedMembershipTier?.accessHours || UI_STRINGS.LABELS.N_A}
              </span>
            </div>
          </div>
          {selectedConditionNames.length > 0 && (
            <div className="detail-card">
              <h3>{TEXT.HEADERS.HEALTH_CONDITIONS}</h3>
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

