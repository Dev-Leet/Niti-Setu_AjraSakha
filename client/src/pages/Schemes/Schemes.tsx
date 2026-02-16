import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchSchemes } from '@store/slices/schemeSlice';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@components/common/Card/Card';
import { Loader } from '@components/common/Loader/Loader';
import styles from './Schemes.module.css';
import type { Scheme } from './types';

export const Schemes: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { schemes, loading } = useAppSelector((state) => state.scheme as { schemes: Scheme[]; loading: boolean });

  useEffect(() => {
    dispatch(fetchSchemes());
  }, [dispatch]);

  if (loading) return <Loader fullScreen />;

  const schemesList = Array.isArray(schemes) ? schemes : [];

  return (
    <Section>
      <Container>
        <PageHeader
          title="Browse Schemes"
          description="Explore all available agricultural schemes"
        />

        <div className={styles.grid}>
          {schemesList.map((scheme) => (
            <Card
              key={scheme.id}
              onClick={() => navigate(`/scheme/${scheme.id}`)}
              hoverable
            >
              <h3>{scheme.name.en}</h3>
              <p className={styles.ministry}>{scheme.ministry}</p>
              <p className={styles.description}>{scheme.description.en}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};