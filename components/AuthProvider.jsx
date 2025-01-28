'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthProvider = ({ children }) => {
  useEffect(() => {
    // Get role from cookie
    const userRole = Cookies.get('user-role');
    
    if (userRole) {
      try {
        // Store in localStorage
        localStorage.setItem('role', userRole);
      } catch (error) {
        console.error('Error storing role in localStorage:', error);
      }
    }
  }, []);

  return children;
};

export default AuthProvider;
