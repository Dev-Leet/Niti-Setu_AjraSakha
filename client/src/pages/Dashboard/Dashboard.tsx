import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCheckHistory } from '@store/slices/eligibilitySlice';
import { fetchSavedSchemes } from '@store/slices/schemeSlice';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { formatDate, formatNumber } from '@utils/formatters';
import styles from './Dashboard.module.css';
//import { EligibilityCheckResponse } from '@services/eligibility.service';
import { Scheme } from '@services/scheme.service';
import { CheckHistoryItem } from './types';
/* import { Loader } from '@components/common/Loader/Loader';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHeader } from '@/components/layout/PageHeader'; */
 
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { history } = useAppSelector((state) => state.eligibility);
  const { savedSchemes } = useAppSelector((state) => state.scheme);
  const { profile } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchCheckHistory());
    dispatch(fetchSavedSchemes());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <Button variant="primary" onClick={() => navigate('/profile')}>
          New Eligibility Check
        </Button>
      </div>

      <div className={styles.stats}>
        <Card className={styles.statCard}>
          <h3>Total Checks</h3>
          <p className={styles.statValue}>{formatNumber(history.length)}</p>
        </Card>
        <Card className={styles.statCard}>
          <h3>Saved Schemes</h3>
          <p className={styles.statValue}>{formatNumber(savedSchemes.length)}</p>
        </Card>
        <Card className={styles.statCard}>
          <h3>Profile Status</h3>
          <p className={styles.statValue}>{profile ? 'Complete' : 'Incomplete'}</p>
        </Card>
      </div>

      <div className={styles.section}>
        <h2>Recent Checks</h2>
        {history.length === 0 ? (
          <Card>
            <p>No eligibility checks yet</p>
          </Card>
        ) : (
          <div className={styles.list}>
            {history.map((check: CheckHistoryItem) => (
              <Card
                key={check.checkId}
                className={styles.checkCard}
                onClick={() => navigate(`/results/${check.checkId}`)}
                hoverable
              >
                <div className={styles.checkHeader}>
                  <span className={styles.date}>{formatDate(check.createdAt)}</span>
                  <span className={styles.count}>
                    {check.totalEligible} eligible schemes
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2>Saved Schemes</h2>
        {savedSchemes.length === 0 ? (
          <Card>
            <p>No saved schemes</p>
          </Card>
        ) : (
          <div className={styles.grid}>
            {savedSchemes.map((scheme: Scheme) => (
              <Card
                key={scheme.id}
                className={styles.schemeCard}
                onClick={() => navigate(`/scheme/${scheme.id}`)}
                hoverable
              >
                <h3>{scheme.name.en}</h3>
                <p>{scheme.description.en.substring(0, 100)}...</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};