import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthProvider = ({ children }) => {
  // const navigate = useNavigate();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const adminInfo = localStorage.getItem('adminInfo');
  //   if (adminInfo) {
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/dashboard');
  //   } else {
  //     // navigate('/login');
  //     return
  //   }
  // }, [isAuthenticated, navigate]);

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}

export default AuthProvider
