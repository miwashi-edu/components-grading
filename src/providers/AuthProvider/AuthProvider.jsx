import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';
import { useConfig } from '..';
import { login as loginAction } from './login';
import { logout as logoutAction } from './logout';
import { publicCall as publicCallAction } from './publicCall';
import { secureCall as secureCallAction } from './secureCall';

const AuthProvider = ({ children }) => {
  const { BACKEND_API, ENDPOINTS, AUTH_STATES } = useConfig();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    return loginAction({
      email,
      password,
      BACKEND_API,
      ENDPOINTS,
      setUser,
      setAccessToken,
      setLoading,
      setError
    });
  }, [BACKEND_API, ENDPOINTS]);

  const logout = useCallback(() => {
    logoutAction({ setUser, setAccessToken });
  }, []);

  const publicCall = useCallback(async (body, options, endpoint) => {
    return publicCallAction({ BACKEND_API, endpoint, body, options });
  }, [BACKEND_API]);

  const secureCall = useCallback(async (body, options, endpoint) => {
    return secureCallAction({
      BACKEND_API,
      ENDPOINTS,
      endpoint,
      accessToken,
      setAccessToken,
      body,
      options
    });
  }, [BACKEND_API, ENDPOINTS, accessToken]);

  const authState = useMemo(() => {
    if (!accessToken || !user) return AUTH_STATES.STATE_IDLE;
    if (user.isSuperUser) return AUTH_STATES.STATE_SUPERUSER;
    if (user.isAdmin) return AUTH_STATES.STATE_ADMIN;
    return AUTH_STATES.STATE_AUTHORISED;
  }, [accessToken, user, AUTH_STATES]);

  const value = useMemo(() => ({
    user,
    accessToken,
    loading,
    error,
    auth: login,
    logout,
    publicCall,
    secureCall,
    isAuthenticated: !!accessToken,
    authState,
  }), [user, accessToken, loading, error, login, logout, publicCall, secureCall, authState]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
