import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchSavedSchemes } from '@store/slices/schemeSlice';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@components/common/Card/Card';
import { Button } from '@components/common/Button/Button';
import { Loader } from '@components/common/Loader/Loader';
import styles from './SchemeComparison.module.css';
 
interface SavedScheme {
  _id: string;
  name: { en: string };
  ministry: string;
  benefits?: { financial?: { amount: number } };
  eligibilityRules?: { maxLandholding?: number };
}

export const SchemeComparison: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { savedSchemes, loading } = useAppSelector((state) => state.scheme);

  useEffect(() => {
    dispatch(fetchSavedSchemes());
  }, [dispatch]);

  if (loading) return <Loader fullScreen />;

  const schemesList = Array.isArray(savedSchemes) ? savedSchemes : [];

  return (
    <Section>
      <Container size="xl">
        <PageHeader
          title="Compare Schemes"
          //description="Side-by-side comparison of eligible schemes"
        />

        {schemesList.length === 0 ? (
          <Card>
            <div className={styles.emptyState}>
              <p>No schemes to compare</p>
              <Button variant="primary" onClick={() => navigate('/schemes')}>
                Browse Schemes
              </Button>
            </div>
          </Card>
        ) : (
          <div className={styles.comparisonTable}>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  {schemesList.map((scheme: SavedScheme) => (
                    <th key={scheme._id}>{scheme.name.en}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.featureLabel}>Ministry</td>
                  {schemesList.map((scheme: SavedScheme) => (
                    <td key={scheme._id}>{scheme.ministry}</td>
                  ))}
                </tr>
                <tr>
                  <td className={styles.featureLabel}>Financial Benefit</td>
                  {schemesList.map((scheme: SavedScheme) => (
                    <td key={scheme._id}>₹{scheme.benefits?.financial?.amount || 'N/A'}</td>
                  ))}
                </tr>
                <tr>
                  <td className={styles.featureLabel}>Max Land Holding</td>
                  {schemesList.map((scheme: SavedScheme) => (
                    <td key={scheme._id}>
                      {scheme.eligibilityRules?.maxLandholding || 'No limit'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className={styles.featureLabel}>Actions</td>
                  {schemesList.map((scheme: SavedScheme) => (
                    <td key={scheme._id}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/scheme/${scheme._id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </Section>
  );
};