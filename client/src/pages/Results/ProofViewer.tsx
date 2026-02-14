import React from 'react';
import { Modal } from '@components/common/Modal/Modal';
import { Button } from '@components/common/Button/Button';
import type { ProofData } from './types';
import styles from './Results.module.css';

interface ProofViewerProps {
  isOpen: boolean;
  onClose: () => void;
  proof: ProofData | null;
} 

export const ProofViewer: React.FC<ProofViewerProps> = ({ isOpen, onClose, proof }) => {
  if (!proof) return null;

  const handleDownload = () => {
    const content = `
Eligibility Proof
================

Scheme: ${proof.schemeName}
Status: ${proof.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
Confidence: ${Math.round(proof.confidence * 100)}%
Date: ${new Date(proof.generatedAt).toLocaleDateString()}

Citations:
${proof.citations.map((c, i) => `
${i + 1}. Page ${c.page}
   "${c.text}"
   Source: ${c.documentUrl}
`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eligibility-proof-${proof.schemeId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eligibility Proof">
      <div className={styles.proofContent}>
        <div className={styles.proofHeader}>
          <h3>{proof.schemeName}</h3>
          <span className={proof.isEligible ? styles.eligible : styles.notEligible}>
            {proof.isEligible ? '✓ Eligible' : '✗ Not Eligible'}
          </span>
        </div>

        <div className={styles.proofMeta}>
          <p>
            <strong>Confidence:</strong> {Math.round(proof.confidence * 100)}%
          </p>
          <p>
            <strong>Generated:</strong> {new Date(proof.generatedAt).toLocaleString()}
          </p>
        </div>

        <div className={styles.proofCitations}>
          <h4>Supporting Citations</h4>
          {proof.citations.map((citation, idx) => (
            <div key={idx} className={styles.proofCitation}>
              <span className={styles.citationNum}>{idx + 1}</span>
              <div>
                <p className={styles.citationText}>&quot;{citation.text}&quot;</p>
                <a
                  href={citation.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.citationSource}
                >
                  Page {citation.page} - View Source
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.proofActions}>
          <Button variant="primary" onClick={handleDownload}>
            Download Proof
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};