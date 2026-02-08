import React from 'react';
import { Card } from '@components/common/Card/Card';
import type { Citation } from './types';
import styles from './SchemeDetail.module.css';

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation, index }) => {
  return (
    <Card className={styles.citationCard}>
      <div className={styles.citationHeader}>
        <span className={styles.citationNumber}>Citation {index + 1}</span>
        <span className={styles.citationPage}>Page {citation.page}</span>
      </div>
      <p className={styles.citationText}>&quot;{citation.text}&quot;</p>
      <a
        href={citation.documentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.citationLink}
        >
        View Source Document &rarr;
      </a>
    </Card>
  );
};