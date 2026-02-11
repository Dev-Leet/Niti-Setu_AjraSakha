import React from 'react';
import { Button } from '@components/common/Button/Button';
import axios from 'axios';
import styles from './ExportButtons.module.css';

interface Props {
  checkId: string;
}

export const ExportButtons: React.FC<Props> = ({ checkId }) => {
  const handleExport = async (format: 'csv' | 'pdf') => {
    const url = `${import.meta.env.VITE_API_URL}/export/${format}/${checkId}`;
    const token = localStorage.getItem('accessToken');

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `eligibility-${checkId}.${format}`;
    link.click();
  };

  return (
    <div className={styles.container}>
      <Button variant="outline" onClick={() => handleExport('csv')}>
        Export CSV
      </Button>
      <Button variant="outline" onClick={() => handleExport('pdf')}>
        Export PDF
      </Button>
    </div>
  );
};