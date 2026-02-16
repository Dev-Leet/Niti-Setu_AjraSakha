import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCheckById } from '@store/slices/eligibilitySlice';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import styles from './Results.module.css';

interface Citation {
  page: number;
  text: string;
}

interface EligibilityResult {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  citations?: Citation[];
}

export const Results: React.FC = () => {
  const { checkId } = useParams<{ checkId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentCheck, loading } = useAppSelector((state) => state.eligibility);

  useEffect(() => {
    if (checkId) {
      dispatch(fetchCheckById(checkId));
    }
  }, [checkId, dispatch]);

  if (loading) return <Loader fullScreen />;
  if (!currentCheck) return <div>No results found</div>;

  const results = Array.isArray(currentCheck.results) ? currentCheck.results : [];

  return (
    <Section>
      <Container>
        <PageHeader
          title="Eligibility Results"
          description="Your personalized scheme eligibility report"
        />

        <div className={styles.resultsGrid}>
          {results.map((result: EligibilityResult, index: number) => (
            <Card key={index} className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <h3>{result.schemeName}</h3>
                <span className={result.isEligible ? styles.eligible : styles.notEligible}>
                  {result.isEligible ? '✓ Eligible' : '✗ Not Eligible'}
                </span>
              </div>

              <div className={styles.resultBody}>
                <div className={styles.confidence}>
                  <span className={styles.label}>Confidence:</span>
                  <span className={styles.value}>{(result.confidence * 100).toFixed(0)}%</span>
                </div>

                <p className={styles.reasoning}>{result.reasoning}</p>

                {Array.isArray(result.citations) && result.citations.length > 0 && (
                  <div className={styles.citations}>
                    <h4>Document Proof:</h4>
                    {result.citations.map((citation: Citation, idx: number) => (
                      <div key={idx} className={styles.citation}>
                        <span className={styles.citationPage}>Page {citation.page}</span>
                        <p className={styles.citationText}>{citation.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {result.isEligible && (
                  <div className={styles.actions}>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/scheme/${result.schemeId}`)}
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className={styles.bottomActions}>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button variant="primary" onClick={() => navigate('/check-eligibility')}>
            Check Another Profile
          </Button>
        </div>
      </Container>
    </Section>
  );
};