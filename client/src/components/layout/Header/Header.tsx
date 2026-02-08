import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { toggleSidebar, setLanguage } from '@store/slices/uiSlice';
import { Button } from '@components/common/Button/Button';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { language } = useAppSelector((state) => state.ui);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(e.target.value as 'en' | 'hi' | 'mr'));
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src="/assets/icons/logo.svg" alt="Logo" />
          <span>AgriSchemes</span>
        </Link>

        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
              <Link to="/profile" className={styles.navLink}>Profile</Link>
              <select 
                value={language} 
                onChange={handleLanguageChange} 
                className={styles.langSelect}
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
              <div className={styles.user}>
                <span>{user?.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <select 
                value={language} 
                onChange={handleLanguageChange} 
                className={styles.langSelect}
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>

        <button className={styles.menuBtn} onClick={() => dispatch(toggleSidebar())} aria-label="Toggle menu">
          ☰
        </button>
      </div>
    </header>
  );
};