import fs from 'fs';
const serverFile = 'server.js';
const header = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0';
const createTokens = `const createTokens = (user) => {
  const { password, ...userWithoutPassword } = user;
  const payload = Buffer.from(JSON.stringify({ ...userWithoutPassword, iat: Math.floor(Date.now() / 1000) })).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return {
    accessToken: \`${header}.\${payload}.\`,
    refreshToken: \`refresh-token-\${user.id}-\${Date.now()}\`
  };
};`;
let content = fs.readFileSync(serverFile, 'utf8');
content = content.replace(/const base64url = [\s\S]*?};

/, '');
content = content.replace(/const createTokens = [\s\S]*?};/, createTokens);
content = content.replace(/};\s*};/, '};');
fs.writeFileSync(serverFile, content);