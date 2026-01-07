/**
 * Core type definitions for Lucidence Platform
 * All TypeScript interfaces and types are defined here for consistency
 */

// User roles enum - matches Firestore security rules
export type UserRole = 'ADMIN' | 'STAFF' | 'CLIENT' | 'LEAD';

// User status enum
export type UserStatus = 'active' | 'pending' | 'disabled';

// Assignment status for staff-client mappings
export type AssignmentStatus = 'active' | 'inactive' | 'pending';

// User document in Firestore
export interface User {
  userId: string; // Firebase UID
  email: string;
  displayName?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Lead document in Firestore
export interface Lead {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  clinicName: string;
  address: string;
  reasonForContact: string;
  referralSource: string;
  surveyResponses: SurveyResponses;
  status: 'new' | 'contacted' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Survey responses for lead form
export interface SurveyResponses {
  interestedInWebsite: boolean;
  interestedInChatbot: boolean;
  interestedInAIAgent: boolean;
  interestedInReceptionist: boolean;
  additionalNotes?: string;
}

// Firebase SDK configuration for client projects
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Client project document in Firestore
export interface ClientProject {
  clientProjectId: string; // Globally unique
  clientId: string; // Reference to users collection
  clientProjectName: string;
  firebaseConfig: FirebaseConfig;
  status: 'active' | 'inactive' | 'setup';
  createdAt: Date;
  updatedAt: Date;
}

// Staff-Client project mapping
export interface StaffClientProject {
  staffId: string;
  clientProjectId: string;
  assignmentStatus: AssignmentStatus;
  notes?: string;
  assignedAt: Date;
}

// Auth context state
export interface AuthState {
  user: User | null;
  firebaseUser: import('firebase/auth').User | null;
  loading: boolean;
  error: string | null;
}

// Form field configuration
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}
