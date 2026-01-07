/**
 * Role-based Route Guard Component
 * Protects routes based on user authentication and role
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';
import styles from './RoleGuard.module.css';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

/**
 * RoleGuard component that wraps protected routes
 * - Redirects to login if not authenticated
 * - Redirects to fallback path if user doesn't have required role
 * - Shows loading state while checking authentication
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/unauthorized',
}) => {
  const { user, loading, firebaseUser } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Checking authentication...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but no user profile, show pending state
  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.pendingCard}>
          <h2>Account Pending</h2>
          <p>Your account is pending approval. Please contact an administrator.</p>
        </div>
      </div>
    );
  }

  // Check if user's status is active
  if (user.status !== 'active') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.pendingCard}>
          <h2>Account {user.status === 'pending' ? 'Pending' : 'Disabled'}</h2>
          <p>
            {user.status === 'pending'
              ? 'Your account is pending approval. Please wait for an administrator to activate it.'
              : 'Your account has been disabled. Please contact an administrator.'}
          </p>
        </div>
      </div>
    );
  }

  // Check if user has one of the allowed roles
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

/**
 * Higher-order component for role-based protection
 */
export const withRoleGuard = (
  WrappedComponent: React.ComponentType,
  allowedRoles: UserRole[]
): React.FC => {
  return function ProtectedComponent(props) {
    return (
      <RoleGuard allowedRoles={allowedRoles}>
        <WrappedComponent {...props} />
      </RoleGuard>
    );
  };
};

export default RoleGuard;
