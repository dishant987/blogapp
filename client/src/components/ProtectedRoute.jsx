import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { decodeToken } from '../utils/decode';

const ProtectedRoute = ({ children }) => {
  const [cookies] = useCookies(['accessToken']);

  // Check if the user is authenticated
  const isAuthenticated = () => {
    try {
      const token = cookies.accessToken;
      if (token) {
        const decodedToken = decodeToken(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        return decodedToken.exp > currentTime; // Check if the token is expired
      }
      return false;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the children components
  return children;
};

export default ProtectedRoute;
