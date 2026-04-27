import { createContext, useContext } from 'react';

const ApiContext = createContext(null);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const publicApi = () => useApi().public;
export const secret = () => useApi().secret;
export const admin = () => useApi().admin;
export const superUser = () => useApi().superUser;

export default ApiContext;
