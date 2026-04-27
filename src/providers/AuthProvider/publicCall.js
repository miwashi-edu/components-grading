export const publicCall = async ({ BACKEND_API, endpoint, body = null, options = {} }) => {
  const { method, url } = endpoint;
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BACKEND_API}${url}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Public call failed with status ${response.status}`);
  }

  return data;
};
