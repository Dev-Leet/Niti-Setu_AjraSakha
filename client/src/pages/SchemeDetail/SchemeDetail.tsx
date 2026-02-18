/* import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchSchemeById, saveScheme } from '@store/slices/schemeSlice';
import { Button } from '@components/common/Button/Button';
import { Card } from '@components/common/Card/Card';
import { Loader } from '@components/common/Loader/Loader';
import { CitationCard } from './CitationCard';
import { formatCurrency } from '@utils/formatters';
import styles from './SchemeDetail.module.css';
  
export const SchemeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentScheme, loading } = useAppSelector((state) => state.scheme);
  const { currentCheck } = useAppSelector((state) => state.eligibility);

  useEffect(() => {
    if (id) {
      dispatch(fetchSchemeById(id));
    }
  }, [id, dispatch]);

  if (loading || !currentScheme) {
    return <Loader fullScreen />;
  }

  const schemeResult = currentCheck?.results.find((r) => r.schemeId === id);
  const isEligible = schemeResult?.isEligible || false;

  const handleSave = async () => {
    if (id) {
      await dispatch(saveScheme({ schemeId: id }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          &larr; Back
        </Button>
        <Button variant="outline" onClick={handleSave}>
          Save Scheme
        </Button>
      </div>

      <Card className={styles.heroCard}>
        <div className={styles.badge}>
          {isEligible ? '✓ You are Eligible' : '✗ Not Eligible'}
        </div>
        <h1 className={styles.title}>{currentScheme.name.en}</h1>
        <p className={styles.ministry}>{currentScheme.ministry}</p>
        <p className={styles.description}>{currentScheme.description.en}</p>
      </Card>

      {isEligible && schemeResult && (
        <Card className={styles.section}>
          <h2>Your Benefits</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <span className={styles.benefitLabel}>Financial Benefit</span>
              <span className={styles.benefitValue}>
                {formatCurrency(schemeResult.benefits.financial.amount)}
              </span>
              <span className={styles.benefitType}>
                {schemeResult.benefits.financial.type} - {schemeResult.benefits.financial.frequency}
              </span>
            </div>
          </div>
          {schemeResult.benefits.nonFinancial.length > 0 && (
            <div className={styles.nonFinancial}>
              <h3>Additional Benefits</h3>
              <ul>
                {schemeResult.benefits.nonFinancial.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {schemeResult?.citations && schemeResult.citations.length > 0 && (
        <div className={styles.section}>
          <h2>Eligibility Proof</h2>
          <p className={styles.sectionSubtitle}>
            These citations from official documents verify your eligibility
          </p>
          <div className={styles.citationsGrid}>
            {schemeResult.citations.map((citation, idx) => (
              <CitationCard key={idx} citation={citation} index={idx} />
            ))}
          </div>
        </div>
      )}

      <Card className={styles.section}>
        <h2>Eligibility Criteria</h2>
        <ul className={styles.criteriaList}>
          {currentScheme.eligibilityRules?.minLandholding && (
            <li>Minimum landholding: {currentScheme.eligibilityRules.minLandholding} acres</li>
          )}
          {currentScheme.eligibilityRules?.maxLandholding && (
            <li>Maximum landholding: {currentScheme.eligibilityRules.maxLandholding} acres</li>
          )}
          {currentScheme.eligibilityRules?.allowedStates && (
            <li>States: {currentScheme.eligibilityRules.allowedStates.join(', ')}</li>
          )}
          {currentScheme.eligibilityRules?.allowedCategories && (
            <li>Categories: {currentScheme.eligibilityRules.allowedCategories.join(', ')}</li>
          )}
          {currentScheme.eligibilityRules?.allowedCrops && (
            <li>Crops: {currentScheme.eligibilityRules.allowedCrops.join(', ')}</li>
          )}
        </ul>
      </Card>

      <Card className={styles.section}>
        <h2>Required Documents</h2>
        <ul className={styles.documentsList}>
          {currentScheme.requiredDocuments?.map((doc: string, idx: number) => (
            <li key={idx}>
              <span className={styles.docIcon}>📄</span>
              {doc}
            </li>
          ))}
        </ul>
      </Card>

      {currentScheme.applicationDeadline && (
        <Card className={styles.deadlineCard}>
          <span className={styles.deadlineIcon}>⚠️</span>
          <div>
            <h3>Application Deadline</h3>
            <p>{new Date(currentScheme.applicationDeadline).toLocaleDateString('en-IN')}</p>
          </div>
        </Card>
      )}

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="lg"
          onClick={() => window.open(currentScheme.officialUrl, '_blank')}
        >
          Apply Now on Official Portal
        </Button>
        <Button variant="outline" size="lg" onClick={handleSave}>
          Save for Later
        </Button>
      </div>
    </div>
  );
}; */

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchSchemeById, saveScheme } from '@store/slices/schemeSlice';
import { Container } from '@/components/layout/Container/Container';
import { Section } from '@/components/layout/Section/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/common/Button/Button';
import { CitationCard } from './CitationCard';
import type { Citation } from './types';

export const SchemeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentScheme, loading } = useAppSelector(state => state.scheme);

  useEffect(() => {
    if (id) {
      dispatch(fetchSchemeById(id));
    }
  }, [id, dispatch]);

  const handleSave = () => {
    if (id) {
      dispatch(saveScheme(id));
    }
  };

  if (loading) {
    return (
      <Container>
        <Section>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </Section>
      </Container>
    );
  }

  if (!currentScheme) {
    return (
      <Container>
        <Section>
          <p className="text-center text-gray-600">Scheme not found</p>
        </Section>
      </Container>
    );
  }

  const mockCitations: Citation[] = [
    {
      text: 'Farmers with landholding less than 2 hectares are eligible',
      page: 4,
      section: 'Eligibility Criteria',
      confidence: 0.95,
      documentUrl: '/documents/scheme.pdf',
    },
  ];

  return (
    <Container>
      <Section>
        <PageHeader title={currentScheme.name.en}>
          <Button onClick={handleSave}>Save Scheme</Button>
        </PageHeader>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Ministry</h3>
            <p>{currentScheme.ministry}</p>
          </div>

          {currentScheme.benefits && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Benefits</h3>
              {currentScheme.benefits.financial && (
                <p className="text-2xl font-bold text-green-600">
                  ₹{currentScheme.benefits.financial.amount.toLocaleString()}
                  {currentScheme.benefits.financial.unit && `/${currentScheme.benefits.financial.unit}`}
                </p>
              )}
              {currentScheme.benefits.description && (
                <p className="mt-2">{currentScheme.benefits.description}</p>
              )}
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Citations</h3>
            <div className="space-y-4">
              {mockCitations.map((citation, idx) => (
<CitationCard key={idx} citation={citation} index={idx} />
))}
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
};