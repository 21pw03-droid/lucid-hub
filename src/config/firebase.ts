/**
 * Firebase Configuration for Lucidence Platform
 * 
 * IMPORTANT: Replace these placeholder values with your actual Firebase config
 * You can find these values in your Firebase Console:
 * 1. Go to https://console.firebase.google.com
 * 2. Select your project
 * 3. Click on the gear icon (Settings) > Project settings
 * 4. Scroll down to "Your apps" section
 * 5. Copy the firebaseConfig object
 * 
 * For production, consider using environment variables:
 * - Create a .env file (add to .gitignore)
 * - Use import.meta.env.VITE_* to access env variables
 */

import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import type { FirebaseConfig } from '../types';

// Main Lucidence Platform Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'YOUR_MEASUREMENT_ID',
};

// Initialize the main Firebase app
// Check if app already exists to prevent duplicate initialization
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Export Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

/**
 * Initialize a secondary Firebase app for client projects
 * This enables multi-tenant functionality where each client can have their own Firebase project
 * 
 * @param config - The client's Firebase configuration
 * @param appName - Unique name for this Firebase app instance
 * @returns Object containing the initialized app, auth, and firestore instances
 */
export const initializeClientFirebaseApp = (
  config: FirebaseConfig,
  appName: string
): { app: FirebaseApp; auth: Auth; db: Firestore } => {
  // Check if this app already exists
  const existingApps = getApps();
  const existingApp = existingApps.find(a => a.name === appName);
  
  if (existingApp) {
    return {
      app: existingApp,
      auth: getAuth(existingApp),
      db: getFirestore(existingApp),
    };
  }
  
  // Initialize new app with client config
  const clientApp = initializeApp(config, appName);
  return {
    app: clientApp,
    auth: getAuth(clientApp),
    db: getFirestore(clientApp),
  };
};

/**
 * Validate Firebase configuration
 * @param config - Firebase configuration to validate
 * @returns Boolean indicating if the config appears valid
 */
export const isValidFirebaseConfig = (config: FirebaseConfig): boolean => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];
  
  return requiredFields.every(
    field => config[field] && !config[field].includes('YOUR_')
  );
};

export default app;
