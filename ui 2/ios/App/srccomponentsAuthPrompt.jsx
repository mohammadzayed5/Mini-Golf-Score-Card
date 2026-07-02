import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Haptics } from '@capacitor/haptics';
import './AuthPrompt.css';

function AuthPrompt({ onClose, redirectTo = '/' }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await Haptics.impact({ style: 'light' });
      
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      
      // Success haptic
      await Haptics.impact({ style: 'medium' });
      onClose();
      
      // Redirect after successful auth
      if (redirectTo !== '/') {
        window.location.href = redirectTo;
      }
    } catch (err) {
      // Error haptic
      await Haptics.impact({ style: 'heavy' });
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleMode = async () => {
    await Haptics.impact({ style: 'light' });
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      name: ''
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGuestMode = async () => {
    await Haptics.impact({ style: 'light' });
    onClose();
    // Navigate to start a guest game
    window.location.href = '/courses';
  };

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="primary-button auth-submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="button-spinner"></div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>

          <div className="auth-toggle">
            <span>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button type="button" onClick={toggleMode} className="toggle-link">
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <button 
            type="button" 
            onClick={handleGuestMode}
            className="secondary-button guest-button"
          >
            Continue as Guest
          </button>
          
          <p className="guest-note">
            Guest mode stores data locally on this device only
          </p>
        </form>
      </div>
    </div>
  );
}

export default AuthPrompt;