import React from 'react';
import { Card } from '@components/common/Card/Card';
import { formatCurrency } from '@utils/formatters';
import styles from './SchemeComparison.module.css';

interface Scheme {
  id: string;
  name: string;
  benefits: { financial: { amount: number } };
  eligibility: string[];
  deadline?: string;
} 

interface SchemeComparisonProps {
  schemes: Scheme[];
}

export const SchemeComparison: React.FC<SchemeComparisonProps> = ({ schemes }) => {
  if (schemes.length === 0) return null;

  return (
    <div className={styles.container}>
      <h2>Scheme Comparison</h2>
      <div className={styles.grid}>
        {schemes.map((scheme) => (
          <Card key={scheme.id} className={styles.card}>
            <h3>{scheme.name}</h3>
            <div className={styles.row}>
              <span className={styles.label}>Benefits:</span>
              <span className={styles.value}>
                {formatCurrency(scheme.benefits.financial.amount)}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Eligibility:</span>
              <ul className={styles.list}>
                {scheme.eligibility.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            {scheme.deadline && (
              <div className={styles.deadline}>
                Deadline: {scheme.deadline}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};