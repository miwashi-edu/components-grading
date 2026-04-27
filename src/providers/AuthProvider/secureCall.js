export const secureCall = async ({
  BACKEND_API,
  ENDPOINTS,
  endpoint,
  accessToken,
  setAccessToken,
  body = null,
  options = {}
}) => {
  const { method, url } = endpoint;
  
  const performCall = async (token) => {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    return fetch(`${BACKEND_API}${url}`, config);
  };

  let response = await performCall(accessToken);

  // If unauthorized (401), attempt to refresh the token
  if (response.status === 401) {
    try {
      const refreshEndpoint = ENDPOINTS.refresh;
      // Refresh call assumes refreshToken is in an httpOnly cookie
      const refreshResponse = await fetch(`${BACKEND_API}${refreshEndpoint.url}`, {
        method: refreshEndpoint.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Important for sending/receiving cookies
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        // Assuming the refresh response returns a new accessToken
        const newAccessToken = refreshData.accessToken;
        
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          // Retry the original call with the new token
          response = await performCall(newAccessToken);
        }
      }
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError);
      // If refresh fails, let the original 401 response pass through or handle as error
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Secure call failed with status ${response.status}`);
  }

  return data;
};
