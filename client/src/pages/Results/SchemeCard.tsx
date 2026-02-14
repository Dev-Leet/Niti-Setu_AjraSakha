import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { formatCurrency } from '@utils/formatters';
import styles from './Results.module.css';

interface Scheme {
  schemeId: string;
  schemeName: string;
  reasoning: string;
  confidence: number;
  benefits: {
    financial: {
      amount: number;
      type: string;
    };
  }; 
}

interface SchemeCardProps {
  scheme: Scheme;
  isEligible: boolean;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, isEligible }) => {
  const navigate = useNavigate();

  return (
    <Card className={`${styles.schemeCard} ${isEligible ? styles.eligible : styles.notEligible}`}>
      <div className={styles.badge}>
        {isEligible ? '✓ Eligible' : '✗ Not Eligible'}
      </div>
      
      <h3 className={styles.schemeName}>{scheme.schemeName}</h3>
      
      {isEligible && (
        <div className={styles.benefits}>
          <span className={styles.amount}>
            {formatCurrency(scheme.benefits.financial.amount)}
          </span>
          <span className={styles.type}>{scheme.benefits.financial.type}</span>
        </div>
      )}
      
      <p className={styles.reasoning}>{scheme.reasoning}</p>
      
      <div className={styles.confidence}>
        Confidence: {Math.round(scheme.confidence * 100)}%
      </div>
      
      <Button
        variant={isEligible ? 'primary' : 'outline'}
        fullWidth
        onClick={() => navigate(`/scheme/${scheme.schemeId}`)}
      >
        View Details
      </Button>
    </Card>
  );
};