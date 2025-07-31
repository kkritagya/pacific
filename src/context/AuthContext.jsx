import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('pacific_user');
    const savedToken = localStorage.getItem('pacific_token');
    
    if (savedUser && savedToken) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setToken(savedToken);
      // Only set admin state if user is actually an admin
      if (userData.isAdmin) {
        setIsAdmin(true);
      }
    }
    setLoading(false);
  }, []);



  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        setIsAdmin(data.user.isAdmin);
        
        localStorage.setItem('pacific_user', JSON.stringify(data.user));
        localStorage.setItem('pacific_token', data.token);
        
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user.isAdmin) {
        setUser(data.user);
        setToken(data.token);
        setIsAdmin(true);
        
        localStorage.setItem('pacific_user', JSON.stringify(data.user));
        localStorage.setItem('pacific_token', data.token);
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid admin credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        setIsAdmin(data.user.isAdmin);
        
        localStorage.setItem('pacific_user', JSON.stringify(data.user));
        localStorage.setItem('pacific_token', data.token);
        
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setToken(null);
    localStorage.removeItem('pacific_user');
    localStorage.removeItem('pacific_token');
  };

  const value = {
    user,
    isAdmin,
    loading,
    token,
    login,
    adminLogin,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};