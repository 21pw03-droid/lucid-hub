/**
 * Header Component for Lucidence Platform
 * Displays user info, notifications, and logout button
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, showMenuButton = true }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const getRoleBadgeClass = (role: string): string => {
    switch (role) {
      case 'ADMIN':
        return styles.badgeAdmin;
      case 'STAFF':
        return styles.badgeStaff;
      case 'CLIENT':
        return styles.badgeClient;
      default:
        return styles.badgeDefault;
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        {showMenuButton && (
          <button className={styles.menuButton} onClick={onMenuToggle} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <h1 className={styles.pageTitle}>Dashboard</h1>
      </div>

      <div className={styles.headerRight}>
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.displayName || user.email}</span>
              <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                {user.role}
              </span>
            </div>
            <div className={styles.userAvatar}>
              {(user.displayName || user.email)?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        <button className={styles.signOutButton} onClick={handleSignOut}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className={styles.signOutText}>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
