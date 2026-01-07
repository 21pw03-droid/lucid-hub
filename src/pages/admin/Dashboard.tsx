/**
 * Admin Dashboard Page
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeads, getUsers, getClientProjects } from '../../services/firestore';
import styles from './Dashboard.module.css';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ leads: 0, users: 0, projects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leads, users, projects] = await Promise.all([
          getLeads(),
          getUsers(),
          getClientProjects(),
        ]);
        setStats({
          leads: leads.filter(l => l.status === 'new').length,
          users: users.length,
          projects: projects.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>
      <p className={styles.pageSubtitle}>Overview of your platform</p>

      <div className={styles.statsGrid}>
        <Link to="/admin/leads" className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning-dark)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{loading ? '...' : stats.leads}</span>
            <span className={styles.statLabel}>New Leads</span>
          </div>
        </Link>

        <Link to="/admin/users" className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--color-accent-100)', color: 'var(--color-accent-900)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{loading ? '...' : stats.users}</span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
        </Link>

        <Link to="/admin/projects" className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--color-info-light)', color: 'var(--color-info-dark)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{loading ? '...' : stats.projects}</span>
            <span className={styles.statLabel}>Client Projects</span>
          </div>
        </Link>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <Link to="/admin/leads" className={styles.actionCard}>Manage Leads</Link>
          <Link to="/admin/users" className={styles.actionCard}>Manage Users</Link>
          <Link to="/admin/projects" className={styles.actionCard}>Manage Projects</Link>
          <Link to="/admin/assignments" className={styles.actionCard}>Staff Assignments</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
