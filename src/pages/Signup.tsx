/**
 * Signup/Lead Registration Page for Lucidence Platform
 * Public form for potential clients to request access
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createLead } from '../services/firestore';
import type { Lead, SurveyResponses } from '../types';
import styles from './Signup.module.css';

interface FormData {
  name: string;
  email: string;
  mobile: string;
  clinicName: string;
  address: string;
  reasonForContact: string;
  referralSource: string;
  interestedInWebsite: boolean;
  interestedInChatbot: boolean;
  interestedInAIAgent: boolean;
  interestedInReceptionist: boolean;
  additionalNotes: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  mobile: '',
  clinicName: '',
  address: '',
  reasonForContact: '',
  referralSource: '',
  interestedInWebsite: false,
  interestedInChatbot: false,
  interestedInAIAgent: false,
  interestedInReceptionist: false,
  additionalNotes: '',
};

const referralOptions = [
  { value: '', label: 'Select an option' },
  { value: 'google', label: 'Google Search' },
  { value: 'social', label: 'Social Media' },
  { value: 'referral', label: 'Friend/Colleague Referral' },
  { value: 'conference', label: 'Conference/Event' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' },
];

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.mobile.trim()) {
      setError('Please enter your mobile number');
      return false;
    }
    if (!formData.clinicName.trim()) {
      setError('Please enter your clinic/business name');
      return false;
    }
    if (!formData.reasonForContact.trim()) {
      setError('Please tell us your reason for contacting');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const surveyResponses: SurveyResponses = {
        interestedInWebsite: formData.interestedInWebsite,
        interestedInChatbot: formData.interestedInChatbot,
        interestedInAIAgent: formData.interestedInAIAgent,
        interestedInReceptionist: formData.interestedInReceptionist,
        additionalNotes: formData.additionalNotes,
      };

      await createLead({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        clinicName: formData.clinicName,
        address: formData.address,
        reasonForContact: formData.reasonForContact,
        referralSource: formData.referralSource,
        surveyResponses,
      });

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.signupPage}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className={styles.successTitle}>Request Submitted!</h1>
          <p className={styles.successMessage}>
            Thank you for your interest in Lucidence Platform. Our team will review your 
            application and contact you shortly to discuss next steps.
          </p>
          <Link to="/" className={styles.backHomeButton}>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupContainer}>
        {/* Header */}
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className={styles.logoText}>Lucidence</span>
          </Link>
          <h1 className={styles.title}>Request Access</h1>
          <p className={styles.subtitle}>
            Fill out the form below to get started with Lucidence Platform
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={styles.alert}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Contact Information */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Full Name <span className={styles.required}>*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="John Smith"
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address <span className={styles.required}>*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="john@clinic.com"
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mobile" className={styles.label}>
                  Mobile Number <span className={styles.required}>*</span>
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="+1 (555) 000-0000"
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="referralSource" className={styles.label}>
                  How did you hear about us?
                </label>
                <select
                  id="referralSource"
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={isLoading}
                >
                  {referralOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Business Information</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="clinicName" className={styles.label}>
                Clinic/Business Name <span className={styles.required}>*</span>
              </label>
              <input
                id="clinicName"
                name="clinicName"
                type="text"
                value={formData.clinicName}
                onChange={handleChange}
                className={styles.input}
                placeholder="Smith Medical Clinic"
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className={styles.input}
                placeholder="123 Main St, City, State 12345"
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reasonForContact" className={styles.label}>
                Reason for Contacting <span className={styles.required}>*</span>
              </label>
              <textarea
                id="reasonForContact"
                name="reasonForContact"
                value={formData.reasonForContact}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Tell us about your needs and how we can help..."
                rows={4}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Interests Survey */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Areas of Interest</h2>
            <p className={styles.sectionDesc}>
              Select the solutions you're interested in:
            </p>

            <div className={styles.checkboxGrid}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="interestedInWebsite"
                  checked={formData.interestedInWebsite}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className={styles.checkboxLabel}>
                  <strong>Website</strong>
                  <small>AI-powered website solutions</small>
                </span>
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="interestedInChatbot"
                  checked={formData.interestedInChatbot}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className={styles.checkboxLabel}>
                  <strong>Chatbot</strong>
                  <small>Intelligent conversation agents</small>
                </span>
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="interestedInAIAgent"
                  checked={formData.interestedInAIAgent}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className={styles.checkboxLabel}>
                  <strong>AI Agent</strong>
                  <small>Advanced AI assistants</small>
                </span>
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="interestedInReceptionist"
                  checked={formData.interestedInReceptionist}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className={styles.checkboxLabel}>
                  <strong>Receptionist/Automation</strong>
                  <small>Automated front desk solutions</small>
                </span>
              </label>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="additionalNotes" className={styles.label}>
                Additional Notes
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Any additional information you'd like to share..."
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                Submitting...
              </>
            ) : (
              <>
                Submit Request
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>

          {/* Login Link */}
          <p className={styles.loginLink}>
            Already have an account?{' '}
            <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
