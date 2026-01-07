/**
 * Firestore Service Layer for Lucidence Platform
 * Handles all database operations for users, leads, client projects, and staff assignments
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentReference,
  QueryConstraint,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import type {
  User,
  UserRole,
  UserStatus,
  Lead,
  ClientProject,
  StaffClientProject,
  FirebaseConfig,
} from '../types';

// ============ USERS ============

/**
 * Get all users from the users collection
 */
export const getUsers = async (): Promise<User[]> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    userId: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as User[];
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role: UserRole): Promise<User[]> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('role', '==', role), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    userId: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as User[];
};

/**
 * Get a single user by ID
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) return null;
  
  const data = userDoc.data();
  return {
    userId: userDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as User;
};

/**
 * Create a new user (typically called when approving a lead)
 */
export const createUser = async (
  email: string,
  role: UserRole,
  displayName?: string
): Promise<{ userId: string; tempPassword: string }> => {
  // Generate temporary password
  const tempPassword = generateTempPassword();
  
  // Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
  const userId = userCredential.user.uid;
  
  // Create user document in Firestore
  await setDoc(doc(db, 'users', userId), {
    userId,
    email,
    displayName: displayName || email.split('@')[0],
    role,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  // Send password reset email so user can set their own password
  await sendPasswordResetEmail(auth, email);
  
  return { userId, tempPassword };
};

/**
 * Update user details
 */
export const updateUser = async (
  userId: string,
  updates: Partial<Pick<User, 'displayName' | 'role' | 'status'>>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', userId));
};

// ============ LEADS ============

/**
 * Get all leads
 */
export const getLeads = async (status?: Lead['status']): Promise<Lead[]> => {
  const leadsRef = collection(db, 'leads');
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  
  if (status) {
    constraints.unshift(where('status', '==', status));
  }
  
  const q = query(leadsRef, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Lead[];
};

/**
 * Get a single lead by ID
 */
export const getLeadById = async (leadId: string): Promise<Lead | null> => {
  const leadRef = doc(db, 'leads', leadId);
  const leadDoc = await getDoc(leadRef);
  
  if (!leadDoc.exists()) return null;
  
  const data = leadDoc.data();
  return {
    id: leadDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Lead;
};

/**
 * Create a new lead (from public signup form)
 */
export const createLead = async (leadData: Omit<Lead, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const leadsRef = collection(db, 'leads');
  const newLeadRef = doc(leadsRef);
  
  await setDoc(newLeadRef, {
    ...leadData,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return newLeadRef.id;
};

/**
 * Update lead status
 */
export const updateLeadStatus = async (leadId: string, status: Lead['status']): Promise<void> => {
  const leadRef = doc(db, 'leads', leadId);
  await updateDoc(leadRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Approve a lead and create a client user
 */
export const approveLead = async (leadId: string): Promise<{ userId: string }> => {
  const lead = await getLeadById(leadId);
  if (!lead) throw new Error('Lead not found');
  
  // Create user from lead
  const { userId } = await createUser(lead.email, 'CLIENT', lead.name);
  
  // Update lead status
  await updateLeadStatus(leadId, 'approved');
  
  // Create a default client project
  await createClientProject(userId, `${lead.clinicName} Project`);
  
  return { userId };
};

// ============ CLIENT PROJECTS ============

/**
 * Get all client projects
 */
export const getClientProjects = async (clientId?: string): Promise<ClientProject[]> => {
  const projectsRef = collection(db, 'clientProjects');
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  
  if (clientId) {
    constraints.unshift(where('clientId', '==', clientId));
  }
  
  const q = query(projectsRef, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    clientProjectId: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as ClientProject[];
};

/**
 * Get a single client project by ID
 */
export const getClientProjectById = async (projectId: string): Promise<ClientProject | null> => {
  const projectRef = doc(db, 'clientProjects', projectId);
  const projectDoc = await getDoc(projectRef);
  
  if (!projectDoc.exists()) return null;
  
  const data = projectDoc.data();
  return {
    clientProjectId: projectDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as ClientProject;
};

/**
 * Create a new client project
 */
export const createClientProject = async (
  clientId: string,
  projectName: string,
  firebaseConfig?: FirebaseConfig
): Promise<string> => {
  const projectsRef = collection(db, 'clientProjects');
  const newProjectRef = doc(projectsRef);
  
  // Default empty config - to be filled in later by admin
  const defaultConfig: FirebaseConfig = firebaseConfig || {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  };
  
  await setDoc(newProjectRef, {
    clientProjectId: newProjectRef.id,
    clientId,
    clientProjectName: projectName,
    firebaseConfig: defaultConfig,
    status: 'setup',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return newProjectRef.id;
};

/**
 * Update client project
 */
export const updateClientProject = async (
  projectId: string,
  updates: Partial<Pick<ClientProject, 'clientProjectName' | 'firebaseConfig' | 'status'>>
): Promise<void> => {
  const projectRef = doc(db, 'clientProjects', projectId);
  await updateDoc(projectRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a client project
 */
export const deleteClientProject = async (projectId: string): Promise<void> => {
  // First, remove all staff assignments for this project
  const assignments = await getStaffAssignmentsByProject(projectId);
  for (const assignment of assignments) {
    await removeStaffAssignment(assignment.staffId, projectId);
  }
  
  // Then delete the project
  await deleteDoc(doc(db, 'clientProjects', projectId));
};

// ============ STAFF CLIENT PROJECT MAPPINGS ============

/**
 * Get all staff assignments for a project
 */
export const getStaffAssignmentsByProject = async (projectId: string): Promise<StaffClientProject[]> => {
  const mappingsRef = collection(db, 'staffClientProjects');
  const q = query(mappingsRef, where('clientProjectId', '==', projectId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    assignedAt: doc.data().assignedAt?.toDate() || new Date(),
  })) as StaffClientProject[];
};

/**
 * Get all project assignments for a staff member
 */
export const getStaffAssignmentsByStaff = async (staffId: string): Promise<StaffClientProject[]> => {
  const mappingsRef = collection(db, 'staffClientProjects');
  const q = query(mappingsRef, where('staffId', '==', staffId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    assignedAt: doc.data().assignedAt?.toDate() || new Date(),
  })) as StaffClientProject[];
};

/**
 * Assign a staff member to a client project
 */
export const assignStaffToProject = async (
  staffId: string,
  clientProjectId: string,
  notes?: string
): Promise<void> => {
  // Composite key: staffId_clientProjectId
  const mappingId = `${staffId}_${clientProjectId}`;
  const mappingRef = doc(db, 'staffClientProjects', mappingId);
  
  await setDoc(mappingRef, {
    staffId,
    clientProjectId,
    assignmentStatus: 'active',
    notes: notes || '',
    assignedAt: serverTimestamp(),
  });
};

/**
 * Update staff assignment
 */
export const updateStaffAssignment = async (
  staffId: string,
  clientProjectId: string,
  updates: Partial<Pick<StaffClientProject, 'assignmentStatus' | 'notes'>>
): Promise<void> => {
  const mappingId = `${staffId}_${clientProjectId}`;
  const mappingRef = doc(db, 'staffClientProjects', mappingId);
  await updateDoc(mappingRef, updates);
};

/**
 * Remove staff assignment
 */
export const removeStaffAssignment = async (staffId: string, clientProjectId: string): Promise<void> => {
  const mappingId = `${staffId}_${clientProjectId}`;
  await deleteDoc(doc(db, 'staffClientProjects', mappingId));
};

// ============ UTILITY FUNCTIONS ============

/**
 * Generate a temporary password
 */
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Convert Firestore Timestamp to Date
 */
export function timestampToDate(timestamp: Timestamp | Date): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
}
