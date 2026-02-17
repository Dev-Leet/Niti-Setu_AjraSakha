/* import React, { useEffect } from 'react';
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
}; */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCheckById } from '@store/slices/eligibilitySlice';
import { Container } from '@/components/layout/Container/Container';
import { Section } from '@/components/layout/Section/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { CitationDisplay } from '@/components/features/CitationDisplay/CitationDisplay';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './Results.module.css';

export const Results = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkId = searchParams.get('checkId');
  const { currentCheck, loading, error } = useAppSelector(state => state.eligibility);

  useEffect(() => {
    if (checkId) {
      dispatch(fetchCheckById(checkId));
    }
  }, [checkId, dispatch]);

  if (loading) {
    return (
      <Container>
        <Section>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </Section>
      </Container>
    );
  }

  if (error || !currentCheck) {
    return (
      <Container>
        <Section>
          <div className="text-center py-12">
            <p className="text-red-600">{error || 'Check not found'}</p>
          </div>
        </Section>
      </Container>
    );
  }

  const results = Array.isArray(currentCheck.results) ? currentCheck.results : [];

  return (
    <Container>
      <Section>
        <PageHeader
          title="Eligibility Results"
          subtitle={`Checked on ${new Date(currentCheck.createdAt).toLocaleDateString()}`}
        />

        <div className="space-y-6">
          {results.map((result, index) => (
            <div
              key={index}
              className={`${styles.resultCard} ${
                result.isEligible ? styles.eligible : styles.notEligible
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={styles.schemeName}>{result.schemeName}</h3>
                  <p className={styles.ministry}>{result.ministry}</p>
                </div>
                <div
                  className={`${styles.statusBadge} ${
                    result.isEligible ? styles.eligibleBadge : styles.notEligibleBadge
                  }`}
                >
                  {result.isEligible ? '✓ Eligible' : '✗ Not Eligible'}
                </div>
              </div>

              <div className={styles.confidenceBar}>
                <div className={styles.confidenceLabel}>
                  Confidence: {(result.confidence * 100).toFixed(0)}%
                </div>
                <div className={styles.confidenceTrack}>
                  <div
                    className={styles.confidenceFill}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className={styles.reasoning}>{result.reasoning}</p>
              </div>

              {result.citations && result.citations.length > 0 && (
                <div className="mt-6">
                  <CitationDisplay citations={result.citations} />
                </div>
              )}

              {result.isEligible && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => navigate(`/schemes/${result.schemeId}`)}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                  >
                    View Scheme Details
                  </button>
                  <button
                    onClick={() => navigate(`/documents/checklist/${result.schemeId}`)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Required Documents
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/profile')}
            className="text-primary hover:underline"
          >
            ← Check Another Profile
          </button>
        </div>
      </Section>
    </Container>
  );
};