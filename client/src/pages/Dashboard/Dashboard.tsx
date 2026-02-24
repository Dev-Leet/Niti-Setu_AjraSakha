import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // ✅ Added
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchDashboardStats } from '@store/slices/dashboardSlice';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import styles from './Dashboard.module.css';

interface RecentCheck {
  id: string;
  schemeName: string;
  date: string;
  eligible: boolean;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(); // ✅ Added
  const { stats, loading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <Loader fullScreen />;

  const recentChecks = Array.isArray(stats?.recentChecks) ? stats.recentChecks : [];

  return (
    <>
      <Section background="gradient" spacing="lg">
        <Container>
          <PageHeader
            title={t('dashboard.welcomeTitle')}
            description={t('dashboard.description')}
            actions={
              <Button variant="primary" onClick={() => navigate('/check-eligibility')}>
                {t('dashboard.checkEligibility')}
              </Button>
            }
          />

          {/* ORIGINAL HARD-CODED VERSION (NOT REMOVED) */}
          {/*
          <PageHeader
            title="Welcome to Niti-Setu AjraSakha"
            description="Your personalized dashboard for agricultural scheme eligibility"
            actions={
              <Button variant="primary" onClick={() => navigate('/check-eligibility')}>
                Check Eligibility
              </Button>
            }
          />
          */}
        </Container>
      </Section>

      <Section>
        <Container>

          {/* ================= STATS GRID ================= */}

          <div className={styles.statsGrid}>
            <Card className={styles.statCard}>
              <h3>{t('dashboard.totalChecks')}</h3>
              <p className={styles.statValue}>{stats?.totalChecks || 0}</p>
            </Card>

            <Card className={styles.statCard}>
              <h3>{t('dashboard.eligibleSchemes')}</h3>
              <p className={styles.statValue}>{stats?.eligibleSchemes || 0}</p>
            </Card>

            <Card className={styles.statCard}>
              <h3>{t('dashboard.savedSchemes')}</h3>
              <p className={styles.statValue}>{stats?.savedSchemes || 0}</p>
            </Card>
          </div>

          {/* ================= RECENT CHECKS ================= */}

          {recentChecks.length > 0 && (
            <Card className={styles.recentCard}>
              <h2 className={styles.sectionTitle}>
                {t('dashboard.recentChecks')}
              </h2>

              <div className={styles.checksList}>
                {recentChecks.map((check: RecentCheck) => (
                  <div key={check.id} className={styles.checkItem}>
                    <div>
                      <h4>{check.schemeName}</h4>
                      <p className={styles.checkDate}>
                        {new Date(check.date).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={
                        check.eligible
                          ? styles.eligible
                          : styles.notEligible
                      }
                    >
                      {check.eligible
                        ? t('dashboard.eligible')
                        : t('dashboard.notEligible')}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </Container>
      </Section>
    </>
  );
};
