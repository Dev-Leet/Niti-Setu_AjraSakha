import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { removeFromComparison, clearComparison } from '@store/slices/comparisonSlice';
import { Button } from '@components/common/Button/Button';
import { Card } from '@components/common/Card/Card';
import styles from './SchemeComparison.module.css';

export const SchemeComparison: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedSchemes } = useAppSelector(state => state.comparison);

  if (selectedSchemes.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>No schemes to compare</h2>
        <Button onClick={() => navigate('/schemes')}>Browse Schemes</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Compare Schemes</h1>
        <Button variant="outline" onClick={() => dispatch(clearComparison())}>
          Clear All
        </Button>
      </div>

      <div className={styles.grid}>
        {selectedSchemes.map(scheme => (
          <Card key={scheme.id} className={styles.schemeCard}>
            <button
              className={styles.removeBtn}
              onClick={() => dispatch(removeFromComparison(scheme.id))}
            >
              ✕
            </button>
            <h3>{scheme.name.en}</h3>
            <p className={styles.ministry}>{scheme.ministry}</p>
            
            <div className={styles.section}>
              <h4>Benefits</h4>
              <p>₹{scheme.benefits.financial.amount}</p>
              <span>{scheme.benefits.financial.frequency}</span>
            </div>

            <div className={styles.section}>
              <h4>Eligibility</h4>
              <ul>
                {scheme.eligibilityRules.minLandholding && (
                  <li>Min: {scheme.eligibilityRules.minLandholding} acres</li>
                )}
                {scheme.eligibilityRules.maxLandholding && (
                  <li>Max: {scheme.eligibilityRules.maxLandholding} acres</li>
                )}
              </ul>
            </div>

            <div className={styles.section}>
              <h4>Required Documents</h4>
              <ul>
                {scheme.requiredDocuments.slice(0, 3).map((doc: string, i: number) => (
                    <li key={i}>{doc}</li>
                    ))
                    }
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};