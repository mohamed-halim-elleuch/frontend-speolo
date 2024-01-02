import React from 'react';
import {Routes, Route, Navigate } from 'react-router-dom';
import {  useCheckAuthentication } from './AuthContext';

const PrivateRoute = ({ element, redirectTo = '/authenticate', ...rest }) => {
  const checkAuthentication = useCheckAuthentication();
  const isAuthenticated = checkAuthentication();

  return isAuthenticated ? (
    <Routes>
      <Route {...rest} element={element} />
    </Routes>
  ) : (
    <>
    <Navigate to={redirectTo} replace={true} />

    </>
  );
};

export default PrivateRoute;