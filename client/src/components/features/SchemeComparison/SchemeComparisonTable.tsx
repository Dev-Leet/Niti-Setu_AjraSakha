import { useEffect, useState, useCallback } from 'react';
import apiClient from '@services/api';
import { Card } from '@/components/common/Card/Card';

interface SchemeComparisonTableProps {
  schemeIds: string[];
}

interface ComparisonScheme {
  schemeId: string;
  schemeName: { en: string };
  ministry: string;
  benefits?: { financial?: { amount: number } };
  applicationDeadline?: string;
  requiredDocuments?: string[];
}

export const SchemeComparisonTable = ({ schemeIds }: SchemeComparisonTableProps) => {
  const [comparison, setComparison] = useState<ComparisonScheme[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComparison = useCallback(async () => {
    try {
      const response = await apiClient.post('/comparison/compare', { schemeIds });
      setComparison(response.data.data);
    } catch (error) {
      console.error('Failed to load comparison:', error);
    } finally {
      setLoading(false);
    }
  }, [schemeIds]);

  useEffect(() => {
    if (schemeIds.length >= 2) {
      loadComparison();
    }
  }, [schemeIds, loadComparison]);

  if (loading) return <div>Loading comparison...</div>;
  if (comparison.length === 0) return <div>Select at least 2 schemes to compare</div>;

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left font-semibold">Feature</th>
              {comparison.map((scheme) => (
                <th key={scheme.schemeId} className="p-3 text-left font-semibold">
                  {scheme.schemeName.en}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3 font-medium">Ministry</td>
              {comparison.map((scheme) => (
                <td key={scheme.schemeId} className="p-3">{scheme.ministry}</td>
              ))}
            </tr>
            <tr className="border-t bg-gray-50">
              <td className="p-3 font-medium">Financial Benefit</td>
              {comparison.map((scheme) => (
                <td key={scheme.schemeId} className="p-3">
                  ₹{scheme.benefits?.financial?.amount || 'N/A'}
                </td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">Application Deadline</td>
              {comparison.map((scheme) => (
                <td key={scheme.schemeId} className="p-3">
                  {scheme.applicationDeadline 
                    ? new Date(scheme.applicationDeadline).toLocaleDateString()
                    : 'Open'}
                </td>
              ))}
            </tr>
            <tr className="border-t bg-gray-50">
              <td className="p-3 font-medium">Documents Required</td>
              {comparison.map((scheme) => (
                <td key={scheme.schemeId} className="p-3">
                  {scheme.requiredDocuments?.length || 0}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};