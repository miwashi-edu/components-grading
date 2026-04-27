export const login = async ({ email, password, BACKEND_API, ENDPOINTS, setUser, setAccessToken, setLoading, setError }) => {
  setLoading(true);
  setError(null);
  try {
    const { method, url } = ENDPOINTS.auth;
    const response = await fetch(`${BACKEND_API}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    setAccessToken(data.accessToken);
    return data;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};
