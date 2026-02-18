import { useState } from 'react';

interface Citation {
  text: string;
  page: number;
  confidence: number;
  section?: string;
}

interface CitationDisplayProps {
  citations: Citation[];
}

export const CitationDisplay = ({ citations }: CitationDisplayProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  if (!citations || citations.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No citations available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900">Document References</h4>
      
      {citations.map((citation, index) => {
        const isExpanded = expandedIndex === index;
        
        return (
          <div
            key={index}
            className={`border rounded-lg overflow-hidden transition-all ${
              getConfidenceColor(citation.confidence)
            }`}
          >
            <button
              onClick={() => toggleExpand(index)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:opacity-80 transition-opacity"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">Page {citation.page}</span>
                  {citation.section && (
                    <span className="text-xs opacity-75">• {citation.section}</span>
                  )}
                  <span className="text-xs opacity-75">
                    • {(citation.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <p className={`text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {citation.text}
                </p>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ml-2 shrink-0 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isExpanded && (
              <div className="px-4 pb-3 pt-1 border-t">
                <div className="text-xs space-y-1 opacity-75">
                  <p>Source: Official Scheme Document</p>
                  <p>Relevance: {(citation.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};