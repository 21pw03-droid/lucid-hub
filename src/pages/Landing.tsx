/**
 * Public Landing Page for Lucidence Platform
 * First page visitors see - contains hero, features, and CTA
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

export const Landing: React.FC = () => {
  return (
    <div className={styles.landing}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className={styles.logoText}>Lucidence</span>
          </div>
          <nav className={styles.nav}>
            <Link to="/login" className={styles.navLink}>Sign In</Link>
            <Link to="/signup" className={styles.ctaButton}>Get Started</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Centralized AI Project
              <span className={styles.heroHighlight}> Management Platform</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Lucidence Platform provides secure authentication and comprehensive management 
              for multiple client AI projects. Streamline your operations with our 
              multi-tenant solution.
            </p>
            <div className={styles.heroActions}>
              <Link to="/signup" className={styles.primaryButton}>
                Request Access
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link to="/login" className={styles.secondaryButton}>
                Sign In
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.visualCard}>
              <div className={styles.visualHeader}>
                <span className={styles.visualDot} />
                <span className={styles.visualDot} />
                <span className={styles.visualDot} />
              </div>
              <div className={styles.visualContent}>
                <div className={styles.visualLine} style={{ width: '80%' }} />
                <div className={styles.visualLine} style={{ width: '60%' }} />
                <div className={styles.visualLine} style={{ width: '90%' }} />
                <div className={styles.visualBox} />
                <div className={styles.visualLine} style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Platform Features</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to manage AI projects efficiently
          </p>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Secure Authentication</h3>
              <p className={styles.featureDesc}>
                Firebase-powered authentication with email, password setup via link, and Google OAuth.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Role-Based Access</h3>
              <p className={styles.featureDesc}>
                Granular permissions with Admin, Staff, Client, and Lead roles for complete control.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Multi-Tenant Projects</h3>
              <p className={styles.featureDesc}>
                Manage multiple client Firebase projects from a single unified dashboard.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="M9 14l2 2 4-4" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Staff Assignment</h3>
              <p className={styles.featureDesc}>
                Assign staff members to client projects with tracking and status management.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Lead Management</h3>
              <p className={styles.featureDesc}>
                Capture and process leads with automated user creation and onboarding workflows.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>AI Integration Ready</h3>
              <p className={styles.featureDesc}>
                Built to support chatbots, AI agents, website automation, and receptionist systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Transform Your AI Operations?</h2>
            <p className={styles.ctaSubtitle}>
              Join businesses that trust Lucidence to manage their AI projects securely and efficiently.
            </p>
            <Link to="/signup" className={styles.ctaMainButton}>
              Request Access Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <span className={styles.logoText}>Lucidence</span>
              </div>
              <p className={styles.footerDesc}>
                Centralized authentication and management for AI projects.
              </p>
            </div>
            <div className={styles.footerLinks}>
              <Link to="/login">Sign In</Link>
              <Link to="/signup">Get Started</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2024 Lucidence Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
