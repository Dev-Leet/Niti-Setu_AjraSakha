import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@components/common/Button/Button';
import { LanguageSelector } from '@components/features/LanguageSelector/LanguageSelector';
import styles from './Home.module.css';
//import { HeroSection } from '@/components/layout/Section/HeroSection';
//import { AnimatedButton } from '@/components/ui/AnimatedButton';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.home}>

      {/* ===================== HERO SECTION ===================== */}

      <section className={styles.hero}>
        <div className={styles.heroInner}>

          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              {t('home.title')}
            </h1>

            <p className={styles.subtitle}>
              {t('home.subtitle')}
            </p>

            <div className={styles.ctaBlock}>
              <div className={styles.cta}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/profile')}
                >
                  {t('home.ctaCheck')}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/schemes')}
                >
                  {t('home.ctaBrowse')}
                </Button>
              </div>

              <div className={styles.langSelector}>
                <LanguageSelector />
              </div>
            </div>
          </div>

          <div className={styles.heroImage}>
            <img src="/assets/images/hero.svg" alt="Farmer" />
          </div>

        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>
          {t('home.howItWorks')}
        </h2>

        <div className={styles.stepsGrid}>

          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>{t('home.step1Title')}</h3>
            <p>{t('home.step1Desc')}</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>{t('home.step2Title')}</h3>
            <p>{t('home.step2Desc')}</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>{t('home.step3Title')}</h3>
            <p>{t('home.step3Desc')}</p>
          </div>

        </div>
      </section>

      {/* ===================== STATS SECTION ===================== */}

      <section className={styles.stats}>
        <div className={styles.statsInner}>

          <div className={styles.stat}>
            <h3>100+</h3>
            <p>{t('results.eligible')}</p>
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

        </div>
      </section>

    </div>
  );
};
