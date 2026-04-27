import fetch from 'node-fetch';

async function testRefresh() {
  const PORT = process.env.PORT || 8083;
  const baseUrl = `http://localhost:${PORT}`;

  console.log('--- Testing /api/auth to get cookie ---');
  const authResponse = await fetch(`${baseUrl}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'password' })
  });

  const authData = await authResponse.json();
  const setCookie = authResponse.headers.get('set-cookie');
  console.log('Auth Status:', authResponse.status);
  console.log('Set-Cookie:', setCookie);

  if (!setCookie) {
    console.error('FAILED: No Set-Cookie header found');
    process.exit(1);
  }

  // Extract the cookie value
  const cookieMatch = setCookie.match(/refreshToken=([^;]+)/);
  if (!cookieMatch) {
    console.error('FAILED: Could not find refreshToken in Set-Cookie');
    process.exit(1);
  }
  const refreshToken = cookieMatch[1];
  console.log('Extracted Refresh Token:', refreshToken);

  console.log('\n--- Testing /api/refresh with cookie ---');
  const refreshResponse = await fetch(`${baseUrl}/api/refresh`, {
    method: 'GET',
    headers: {
      'Cookie': `refreshToken=${refreshToken}`
    }
  });

  const refreshData = await refreshResponse.json();
  console.log('Refresh Status:', refreshResponse.status);
  console.log('Refresh Data:', refreshData);

  if (refreshResponse.status === 200 && refreshData.accessToken) {
    console.log('SUCCESS: New access token received');

    // Decode and verify the payload
    const payloadBase64 = refreshData.accessToken.split('.')[1];
    const payloadJson = Buffer.from(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
    const payload = JSON.parse(payloadJson);
    console.log('Decoded Payload:', payload);

    if (payload.email === 'admin@example.com' && payload.isAdmin === true) {
      console.log('SUCCESS: Payload matches expected user');
    } else {
      console.error('FAILED: Payload does not match');
      process.exit(1);
    }
  } else {
    console.error('FAILED: Could not refresh token');
    process.exit(1);
  }

  console.log('\n--- Testing /api/refresh without cookie ---');
  const failResponse = await fetch(`${baseUrl}/api/refresh`, {
    method: 'GET'
  });
  console.log('Fail Status:', failResponse.status);
  if (failResponse.status === 401) {
    console.log('SUCCESS: Correctly returned 401');
  } else {
    console.error('FAILED: Expected 401, got', failResponse.status);
    process.exit(1);
  }
}

testRefresh().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
