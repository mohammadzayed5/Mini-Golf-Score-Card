import React, { createContext, useContext, useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await Preferences.get({ key: 'authToken' });
      const userData = await Preferences.get({ key: 'userData' });
      
      if (token.value && userData.value) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData.value));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // TODO: Replace with actual API call
      // For now, simulate successful login
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: email
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      await Preferences.set({ key: 'authToken', value: mockToken });
      await Preferences.set({ key: 'userData', value: JSON.stringify(mockUser) });
      
      setIsAuthenticated(true);
      setUser(mockUser);
      
      return { success: true };
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (name, email, password) => {
    try {
      // TODO: Replace with actual API call
      // For now, simulate successful registration
      const mockUser = {
        id: 'user-' + Date.now(),
        name: name,
        email: email
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      await Preferences.set({ key: 'authToken', value: mockToken });
      await Preferences.set({ key: 'userData', value: JSON.stringify(mockUser) });
      
      setIsAuthenticated(true);
      setUser(mockUser);
      
      return { success: true };
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = async () => {
    try {
      await Preferences.remove({ key: 'authToken' });
      await Preferences.remove({ key: 'userData' });
      await Preferences.remove({ key: 'gameHistory' });
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;