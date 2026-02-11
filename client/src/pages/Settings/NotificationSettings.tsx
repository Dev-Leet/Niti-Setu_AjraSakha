import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@components/common/Button/Button';
import styles from './Settings.module.css';

interface Preferences {
  email: { eligibilityResults: boolean; schemeUpdates: boolean; deadlineReminders: boolean };
  sms: { eligibilityResults: boolean; deadlineReminders: boolean };
  push: { eligibilityResults: boolean; schemeUpdates: boolean };
}

export const NotificationSettings: React.FC = () => {
  const [prefs, setPrefs] = useState<Preferences | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem('accessToken');
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrefs(data.data);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('accessToken');
    await axios.put(`${import.meta.env.VITE_API_URL}/preferences`, prefs, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Preferences saved!');
  };

  if (!prefs) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2>Notification Preferences</h2>

      <div className={styles.section}>
        <h3>Email Notifications</h3>
        <label>
          <input
            type="checkbox"
            checked={prefs.email.eligibilityResults}
            onChange={(e) => setPrefs({ ...prefs, email: { ...prefs.email, eligibilityResults: e.target.checked } })}
          />
          Eligibility Results
        </label>
        <label>
          <input
            type="checkbox"
            checked={prefs.email.schemeUpdates}
            onChange={(e) => setPrefs({ ...prefs, email: { ...prefs.email, schemeUpdates: e.target.checked } })}
          />
          Scheme Updates
        </label>
        <label>
          <input
            type="checkbox"
            checked={prefs.email.deadlineReminders}
            onChange={(e) => setPrefs({ ...prefs, email: { ...prefs.email, deadlineReminders: e.target.checked } })}
          />
          Deadline Reminders
        </label>
      </div>

      <div className={styles.section}>
        <h3>SMS Notifications</h3>
        <label>
          <input
            type="checkbox"
            checked={prefs.sms.eligibilityResults}
            onChange={(e) => setPrefs({ ...prefs, sms: { ...prefs.sms, eligibilityResults: e.target.checked } })}
          />
          Eligibility Results
        </label>
        <label>
          <input
            type="checkbox"
            checked={prefs.sms.deadlineReminders}
            onChange={(e) => setPrefs({ ...prefs, sms: { ...prefs.sms, deadlineReminders: e.target.checked } })}
          />
          Deadline Reminders
        </label>
      </div>

      <Button onClick={handleSave}>Save Preferences</Button>
    </div>
  );
};
