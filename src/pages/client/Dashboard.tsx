/**
 * Client Dashboard - placeholder
 */
import React from 'react';
import styles from './Dashboard.module.css';

export const ClientDashboard: React.FC = () => (
  <div className={styles.dashboard}>
    <h1 className={styles.pageTitle}>Client Dashboard</h1>
    <p className={styles.pageSubtitle}>Welcome! Manage your AI projects below.</p>
    <div className={styles.placeholder}>
      <p>Your project details and AI integrations will appear here.</p>
    </div>
  </div>
);

export default ClientDashboard;
