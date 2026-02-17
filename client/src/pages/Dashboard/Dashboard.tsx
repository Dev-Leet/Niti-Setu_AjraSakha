import { useEffect } from 'react';
import { Container } from '@/components/layout/Container/Container';
import { Section } from '@/components/layout/Section/Section';
import { GradientHero } from '@/components/layout/GradientHero';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchDashboardStats } from '@store/slices/dashboardSlice';
import { useNetworkOptimization } from '@/hooks/useNetworkOptimization';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector(state => state.dashboard);
  const { user } = useAppSelector(state => state.auth);
  const { isSlowConnection } = useNetworkOptimization();

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const recentChecks = Array.isArray(stats?.recentChecks) ? stats.recentChecks : [];

  return (
    <>
      <GradientHero>
        <h1 className={styles.heroTitle}>
          Welcome back, {user?.email?.split('@')[0] || 'Farmer'}!
        </h1>
        <p className={styles.heroSubtitle}>
          Check your eligibility for agricultural schemes
        </p>
        {isSlowConnection && (
          <div className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded text-sm">
            Slow connection detected - Some features may be limited
          </div>
        )}
      </GradientHero>

      <Container>
        <Section>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats?.totalChecks || 0}</div>
                  <div className={styles.statLabel}>Eligibility Checks</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats?.eligibleSchemes || 0}</div>
                  <div className={styles.statLabel}>Eligible Schemes</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats?.schemesAnalyzed || 0}</div>
                  <div className={styles.statLabel}>Schemes Analyzed</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{stats?.avgResponseTime || 0}ms</div>
                  <div className={styles.statLabel}>Avg Response Time</div>
                </div>
              </div>

              {recentChecks.length > 0 && (
                <div className={styles.recentChecks}>
                  <h2 className={styles.sectionTitle}>Recent Checks</h2>
                  <div className={styles.checksList}>
                    {recentChecks.map(check => (
                      <div key={check.id} className={styles.checkItem}>
                        <div className={styles.checkInfo}>
                          <span className={styles.checkScheme}>{check.schemeName}</span>
                          <span className={styles.checkDate}>
                            {new Date(check.date).toLocaleDateString()}
                          </span>
                        </div>
                        <span
                          className={`${styles.checkStatus} ${
                            check.eligible ? styles.eligible : styles.notEligible
                          }`}
                        >
                          {check.eligible ? '✓ Eligible' : '✗ Not Eligible'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Section>
      </Container>
    </>
  );
};