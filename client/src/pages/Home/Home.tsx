import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button/Button';
import { LanguageSelector } from '@components/features/LanguageSelector/LanguageSelector';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Find Your Eligible <span>Agricultural Schemes</span>
          </h1>
          <p className={styles.subtitle}>
            Get instant eligibility results for 100+ government schemes with AI-powered analysis
          </p>
          <div className={styles.cta}>
            <Button variant="primary" size="lg" onClick={() => navigate('/profile')}>
              Check Eligibility Now
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/schemes')}>
              Browse Schemes
            </Button>
          </div>
          <div className={styles.langSelector}>
            <LanguageSelector />
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src="/assets/images/hero.svg" alt="Farmer" />
        </div>
      </section>

      <section className={styles.features}>
        <h2>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Share Your Profile</h3>
            <p>Use voice or form to provide your farming details</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>AI Analysis</h3>
            <p>Our system analyzes 100+ schemes in seconds</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Get Results</h3>
            <p>View eligible schemes with verified citations</p>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.stat}>
          <h3>100+</h3>
          <p>Schemes Analyzed</p>
        </div>
        <div className={styles.stat}>
          <h3>10,000+</h3>
          <p>Farmers Helped</p>
        </div>
        <div className={styles.stat}>
          <h3>&lt;10s</h3>
          <p>Response Time</p>
        </div>
        <div className={styles.stat}>
          <h3>95%+</h3>
          <p>Accuracy</p>
        </div>
      </section>
    </div>
  );
};