/**
 * Staff Dashboard - placeholder
 */
import React from 'react';
import styles from './Dashboard.module.css';

export const StaffDashboard: React.FC = () => (
  <div className={styles.dashboard}>
    <h1 className={styles.pageTitle}>Staff Dashboard</h1>
    <p className={styles.pageSubtitle}>Welcome! View your assigned projects below.</p>
    <div className={styles.placeholder}>
      <p>Your assigned client projects will appear here.</p>
    </div>
  </div>
);

export default StaffDashboard;
