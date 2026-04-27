import React, { useState } from 'react';
import { ConfigProvider, AuthProvider, useAuth } from '..';
import ApiProvider from './ApiProvider';
import { public as publicHook, secret as secretHook, admin as adminHook, superUser as superUserHook } from './ApiContext';

const ApiDisplay = () => {
  const publicCall = publicHook();
  const secret = secretHook();
  const admin = adminHook();
  const superUser = superUserHook();
  const { auth, user, logout } = useAuth();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const handleCall = async (name, callFn) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const result = await callFn();
      setResults(prev => ({ ...prev, [name]: result }));
    } catch (err) {
      setResults(prev => ({ ...prev, [name]: { error: err.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const login = async () => {
    try {
      await auth('admin@example.com', 'password');
    } catch (err) {
      console.error('Login failed', err);
    }
  };


  return (
    <div style={{ padding: '1rem' }}>
      <div>
        {user ? (
          <div>
            Logged in as: {user.name} ({user.email})
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button onClick={login}>Login as Admin</button>
        )}
      </div>
      <hr />
      <h3>API Endpoints:</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
          <h4>public</h4>
          <button onClick={() => handleCall('public', publicCall)} disabled={loading['public']}>
            {loading['public'] ? 'Calling...' : 'Call public'}
          </button>
          <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {results['public'] ? JSON.stringify(results['public'], null, 2) : 'No data'}
          </pre>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
          <h4>secret</h4>
          <button onClick={() => handleCall('secret', secret)} disabled={loading['secret']}>
            {loading['secret'] ? 'Calling...' : 'Call secret'}
          </button>
          <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {results['secret'] ? JSON.stringify(results['secret'], null, 2) : 'No data'}
          </pre>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
          <h4>admin</h4>
          <button onClick={() => handleCall('admin', admin)} disabled={loading['admin']}>
            {loading['admin'] ? 'Calling...' : 'Call admin'}
          </button>
          <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {results['admin'] ? JSON.stringify(results['admin'], null, 2) : 'No data'}
          </pre>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
          <h4>superUser</h4>
          <button onClick={() => handleCall('superUser', superUser)} disabled={loading['superUser']}>
            {loading['superUser'] ? 'Calling...' : 'Call superUser'}
          </button>
          <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {results['superUser'] ? JSON.stringify(results['superUser'], null, 2) : 'No data'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default {
  title: 'Providers/ApiProvider',
  component: ApiProvider,
  decorators: [
    (Story) => (
      <ConfigProvider>
        <AuthProvider>
          <Story />
        </AuthProvider>
      </ConfigProvider>
    ),
  ],
};

export const Default = {
  render: () => (
    <ApiProvider>
      <ApiDisplay />
    </ApiProvider>
  ),
};
