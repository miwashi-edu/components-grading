import fetch from 'node-fetch';

const PORT = 1928;
const BASE_URL = `http://localhost:${PORT}`;

async function testAuth() {
  console.log('--- Starting Authentication & Authorization Tests ---');

  // 1. Login as standard user
  console.log('\nTesting Standard User:');
  const loginRes = await fetch(`${BASE_URL}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', password: 'password' })
  });
  const { accessToken } = await loginRes.json();
  
  await checkAccess('Secret', '/api/secret', accessToken, 200);
  await checkAccess('Admin', '/api/admin', accessToken, 403);
  await checkAccess('SuperUser', '/api/superUser', accessToken, 403);

  // 2. Login as admin user
  console.log('\nTesting Admin User:');
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'password' })
  });
  const { accessToken: adminToken } = await adminLoginRes.json();
  
  await checkAccess('Secret', '/api/secret', adminToken, 200);
  await checkAccess('Admin', '/api/admin', adminToken, 200);
  await checkAccess('SuperUser', '/api/superUser', adminToken, 403);

  // 3. Login as superUser
  console.log('\nTesting SuperUser:');
  const superLoginRes = await fetch(`${BASE_URL}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superUser@example.com', password: 'password' })
  });
  const { accessToken: superToken } = await superLoginRes.json();
  
  await checkAccess('Secret', '/api/secret', superToken, 200);
  await checkAccess('Admin', '/api/admin', superToken, 200);
  await checkAccess('SuperUser', '/api/superUser', superToken, 200);

  // 4. No token
  console.log('\nTesting No Token:');
  await checkAccess('Public', '/api/public', null, 200);
  await checkAccess('Secret', '/api/secret', null, 401);

  console.log('\n--- Tests Completed ---');
}

async function checkAccess(name, path, token, expectedStatus) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  const status = res.status;
  
  if (status === expectedStatus) {
    console.log(`✅ ${name} access (${path}): Expected ${expectedStatus}, Got ${status}`);
  } else {
    console.log(`❌ ${name} access (${path}): Expected ${expectedStatus}, Got ${status}`);
    const data = await res.json();
    console.log('   Error:', data.error);
  }
}

testAuth().catch(console.error);
