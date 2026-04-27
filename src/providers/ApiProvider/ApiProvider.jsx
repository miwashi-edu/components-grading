import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ApiContext from './ApiContext';
import { useConfig, useAuth } from '..';

const ApiProvider = ({ children }) => {
  const { ENDPOINTS } = useConfig();
  const { secureCall, publicCall } = useAuth();

  const api = useMemo(() => {
    // Explicitly define methods so they are clearly identifiable in the source
    const methods = {};
    
    // Dynamically map all ENDPOINTS to functions using the proper call type (secure vs public)
    Object.entries(ENDPOINTS).forEach(([name, endpoint]) => {
      methods[name] = (body, options) => {
        const call = endpoint.secure ? secureCall : publicCall;
        return call(body, options, endpoint);
      };
    });

    // Explicitly destructure for clarity (optional, but helps some IDEs/tools find them)
    const { public: publicApi, secret, admin, superUser } = methods;

    return {
      ...methods,
      public: publicApi,
      secret,
      admin,
      superUser,
    };
  }, [ENDPOINTS, secureCall, publicCall]);

  return (
    <ApiContext.Provider value={{ ...api }}>
      {children}
    </ApiContext.Provider>
  );
};

ApiProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ApiProvider;
