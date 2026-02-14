import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>AgriSchemes</h3>
          <p>Simplifying agricultural scheme eligibility</p>
        </div> 
        
        <div className={styles.section}>
          <h4>Quick Links</h4>
          <a href="/about">About</a>
          <a href="/schemes">Browse Schemes</a>
          <a href="/help">Help & Support</a>
        </div>
        
        <div className={styles.section}>
          <h4>Legal</h4>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
        
        <div className={styles.section}>
          <h4>Contact</h4>
          <p>support@agrischemes.com</p>
          <p>+91 1800-XXX-XXXX</p>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <p>&copy; 2026 AgriSchemes. All rights reserved.</p>
      </div>
    </footer>
  );
};