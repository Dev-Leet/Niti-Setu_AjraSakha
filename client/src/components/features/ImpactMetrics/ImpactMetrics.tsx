import { useEffect, useState } from 'react';
import apiClient from '@services/api';

interface ImpactData {
  schemesAnalyzed: number;
  checksPerformed: number;
  pdfChunksIndexed: number;
  avgResponseTimeMs: number;
  p95ResponseTimeMs: number;
}

export const ImpactMetrics = () => {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/analytics/impact')
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-24 bg-gray-100 rounded-xl" />;
  if (!data) return null;

  const metrics = [
    { label: 'Schemes Analyzed', value: data.schemesAnalyzed, icon: '📋' },
    { label: 'Checks Performed', value: data.checksPerformed.toLocaleString(), icon: '✅' },
    { label: 'PDF Chunks Indexed', value: data.pdfChunksIndexed.toLocaleString(), icon: '📄' },
    { label: 'Avg Response Time', value: `${data.avgResponseTimeMs}ms`, icon: '⚡', highlight: data.avgResponseTimeMs > 10000 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map(metric => (
        <div
          key={metric.label}
          className={`rounded-xl p-4 text-center ${metric.highlight ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}
        >
          <div className="text-2xl mb-1">{metric.icon}</div>
          <div className={`text-xl font-bold ${metric.highlight ? 'text-red-600' : 'text-green-700'}`}>
            {metric.value}
          </div>
          <div className="text-xs text-gray-500 mt-1">{metric.label}</div>
        </div>
      ))}
    </div>
  );
};