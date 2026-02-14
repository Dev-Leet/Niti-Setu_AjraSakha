import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@components/common/Card/Card';
import styles from './AdminDashboard.module.css';

interface DashboardStats {
  totalUsers: number;
  totalSchemes: number;
  totalChecks: number;
  avgProcessingTime: number;
  popularSchemes: Array<{ _id: string; name: string; count: number }>;
} 

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('accessToken');
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data.data);
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Admin Dashboard</h1>

      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <h3>Total Users</h3>
          <p className={styles.statValue}>{stats.totalUsers}</p>
        </Card>
        <Card className={styles.statCard}>
          <h3>Active Schemes</h3>
          <p className={styles.statValue}>{stats.totalSchemes}</p>
        </Card>
        <Card className={styles.statCard}>
          <h3>Total Checks</h3>
          <p className={styles.statValue}>{stats.totalChecks}</p>
        </Card>
        <Card className={styles.statCard}>
          <h3>Avg Processing Time</h3>
          <p className={styles.statValue}>{(stats.avgProcessingTime / 1000).toFixed(2)}s</p>
        </Card>
      </div>

      <Card className={styles.popularSchemes}>
        <h2>Popular Schemes</h2>
        <table>
          <thead>
            <tr>
              <th>Scheme</th>
              <th>Checks</th>
            </tr>
          </thead>
          <tbody>
            {stats.popularSchemes.map(scheme => (
              <tr key={scheme._id}>
                <td>{scheme.name}</td>
                <td>{scheme.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};