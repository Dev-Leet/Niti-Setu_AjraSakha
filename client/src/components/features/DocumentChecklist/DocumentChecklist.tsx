import { useEffect, useState, useCallback } from 'react';
import { documentService } from '@/services/document.service';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';

interface DocumentChecklistProps {
  schemeId: string;
  profile: Record<string, unknown>;
}

interface ChecklistItem {
  document: string;
  required: boolean;
  description: string;
  category: string;
}

export const DocumentChecklist = ({ schemeId, profile }: DocumentChecklistProps) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChecklist = useCallback(async () => {
    try {
      const data = await documentService.getChecklist(schemeId, profile);
      setChecklist(data);
    } catch (error) {
      console.error('Failed to load checklist:', error);
    } finally {
      setLoading(false);
    }
  }, [schemeId, profile]);

  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  const downloadHTML = async () => {
    try {
      const blob = await documentService.downloadChecklistHTML(schemeId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `checklist_${schemeId}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download checklist:', error);
    }
  };

  if (loading) return <div>Loading checklist...</div>;

  const groupedByCategory = checklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Required Documents</h2>
        <Button variant="outline" size="sm" onClick={downloadHTML}>
          Download Checklist
        </Button>
      </div>

      {Object.entries(groupedByCategory).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-medium mb-3 capitalize">
            {category.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <input type="checkbox" className="mt-1" aria-label={`Mark ${item.document} as collected`} />
                <div>
                  <div className="font-medium">
                    {item.document}
                    {item.required && <span className="text-red-500 ml-1">*</span>}
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Card>
  );
};