import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 1928;

const USERS = [
  {
    id: crypto.randomUUID(),
    name: 'Standard User',
    email: 'user@example.com',
    password: 'password',
    isAdmin: false,
    isSuperUser: false
  },
  {
    id: crypto.randomUUID(),
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    isAdmin: true,
    isSuperUser: false
  },
  {
    id: crypto.randomUUID(),
    name: 'Super User',
    email: 'superUser@example.com',
    password: 'password',
    isAdmin: true,
    isSuperUser: true
  }
];

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());


// Helper function to create fake tokens
const createTokens = (user) => {
  const { password, ...userWithoutPassword } = user;
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const payload = Buffer.from(JSON.stringify({ ...userWithoutPassword, iat: Math.floor(Date.now() / 1000) })).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return {
    accessToken: `${header}.${payload}.`,
    refreshToken: `refresh-token-${user.id}-${Date.now()}`
  };
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());

    // In a real app, we'd verify the signature here. For this fake JWT, we just check if user exists.
    const user = USERS.find(u => u.id === payload.id);
    if (!user) {
      return res.status(403).json({ error: 'Invalid token: User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Role Authorization Middleware
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (role === 'admin' && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    if (role === 'superUser' && !req.user.isSuperUser) {
      return res.status(403).json({ error: 'Forbidden: SuperUser access required' });
    }

    next();
  };
};

// POST /api/auth/
app.post('/api/auth', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = USERS.find(u => u.email === email && u.password === password);

  if (user) {
    const { accessToken, refreshToken } = createTokens(user);

    // Set refreshToken as httpOnly cookie for /api/refresh path
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user object (without password) and accessToken
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      accessToken
    });
  }

  res.status(401).json({ error: 'Invalid email or password' });
});

// GET /api/refresh
app.get('/api/refresh', (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  // Expecting format: refresh-token-<userId>-<timestamp>
  const parts = refreshToken.split('-');
  if (parts.length < 4) {
    return res.status(401).json({ error: 'Invalid refresh token format' });
  }

  const userId = parts.slice(2, -1).join('-'); // Handle UUIDs with dashes
  const user = USERS.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const { accessToken } = createTokens(user);

  return res.status(200).json({
    message: 'Token refreshed',
    accessToken
  });
});

// GET /api/public
app.get('/api/public', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This is a public endpoint'
  });
});

// GET /api/secret
app.get('/api/secret', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This is a secret endpoint, requires authorization'
  });
});

// GET /api/admin
app.get('/api/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This is an admin endpoint, requires admin role'
  });
});

// GET /api/superUser
app.get('/api/superUser', authenticateToken, authorizeRole('superUser'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This is a superUser endpoint, requires superUser role'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
