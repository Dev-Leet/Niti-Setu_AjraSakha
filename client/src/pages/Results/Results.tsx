// import React, { useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { SchemeCard } from './SchemeCard';
import { Loader } from '@components/common/Loader/Loader';
import { Button } from '@components/common/Button/Button';
import { formatCurrency, formatNumber } from '@utils/formatters';
import styles from './Results.module.css';
 
export const Results: React.FC = () => {
  const navigate = useNavigate();
  const { currentCheck, loading } = useAppSelector((state) => state.eligibility);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!currentCheck) {
    return (
      <div className={styles.empty}>
        <p>No results found</p>
        <Button onClick={() => navigate('/profile')}>Create Profile</Button>
      </div>
    );
  }

  const eligible = currentCheck.results.filter((r) => r.isEligible);
  const notEligible = currentCheck.results.filter((r) => !r.isEligible);

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <h1>Your Eligibility Results</h1>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <h2>{formatNumber(currentCheck.totalEligible)}</h2>
            <p>Eligible Schemes</p>
          </div>
          <div className={styles.stat}>
            <h2>{formatCurrency(currentCheck.totalBenefits)}</h2>
            <p>Total Potential Benefits</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>✓ Eligible Schemes ({eligible.length})</h2>
        <div className={styles.grid}>
          {eligible.map((scheme) => (
            <SchemeCard key={scheme.schemeId} scheme={scheme} isEligible={true} />
          ))}
        </div>
      </div>

      {notEligible.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>✗ Not Eligible ({notEligible.length})</h2>
          <div className={styles.grid}>
            {notEligible.map((scheme) => (
              <SchemeCard key={scheme.schemeId} scheme={scheme} isEligible={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};