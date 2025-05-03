const http = require('http');
const { parse } = require('url');
const config = require('./config');
const connectDB = require('./config/database');
const { handleAuth } = require('./routes/auth.routes');
const { handlePosts } = require('./routes/post.routes');
const { handleUsers } = require('./routes/user.routes');

// Connect to database
connectDB();

const server = http.createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse JSON body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  await new Promise(resolve => {
    req.on('end', () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch (e) {
        req.body = {};
      }
      resolve();
    });
  });

  // Health check endpoint
  if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'success', message: 'Server is running' }));
    return;
  }

  // API routes
  if (path.startsWith('/api/v1/auth')) {
    await handleAuth(req, res);
    return;
  }

  if (path.startsWith('/api/v1/posts')) {
    await handlePosts(req, res);
    return;
  }

  if (path.startsWith('/api/v1/users')) {
    await handleUsers(req, res);
    return;
  }

  // 404 handler
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'error',
    message: `Can't find ${path} on this server!`
  }));
});

server.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;