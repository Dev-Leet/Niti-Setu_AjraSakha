import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container/Container';
import { Section } from '@/components/layout/Section/Section';
import { PageHeader } from '@/components/layout/PageHeader';
import { SchemeCard } from '@/components/features/SchemeCard/SchemeCard';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchSchemes } from '@store/slices/schemeSlice';
import { useLanguage } from '@/hooks/useLanguage';

export const Schemes = () => {
  const dispatch = useAppDispatch();
  const { schemes, loading, error } = useAppSelector(state => state.scheme);
  const { language } = useLanguage();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchSchemes());
  }, [dispatch]);

  const filteredSchemes = Array.isArray(schemes)
    ? schemes.filter(scheme => filter === 'all' || scheme.status === filter)
    : [];

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

  return (
    <Container>
      <Section>
        <PageHeader
          title="Agricultural Schemes"
          subtitle="Explore government schemes and check your eligibility"
        />

        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'upcoming', 'closed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        {filteredSchemes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No schemes available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map(scheme => (
              <SchemeCard key={scheme._id} scheme={scheme} language={language} />
            ))}
          </div>
        )}
      </Section>
    </Container>
  );
};