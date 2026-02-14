import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleSidebar } from '@store/slices/uiSlice';
import { logout } from '@store/slices/authSlice';
import type { NavItem } from './types';
import styles from './Sidebar.module.css';

const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Profile', path: '/profile', icon: '👤' },
  { label: 'Check Eligibility', path: '/profile', icon: '✓' },
];
 
export const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleClose = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = async () => {
    await dispatch(logout());
    handleClose();
  };

  if (!sidebarOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={handleClose} />
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <h2>AgriSchemes</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            ×
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${
                location.pathname === item.path ? styles.active : ''
              }`}
              onClick={handleClose}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {isAuthenticated && (
          <div className={styles.footer}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <span className={styles.icon}>🚪</span>
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};