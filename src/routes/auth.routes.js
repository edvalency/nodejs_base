const { validateUser } = require('../middleware/validators');
const { register, login, getMe, logout } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

exports.handleAuth = async (req, res) => {
  const path = req.url.replace('/api/v1/auth', '');
  
  switch (true) {
    case path === '/register' && req.method === 'POST':
      if (!validateUser(req.body)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Invalid input' }));
        return;
      }
      await register(req, res);
      break;

    case path === '/login' && req.method === 'POST':
      await login(req, res);
      break;

    case path === '/me' && req.method === 'GET':
      await verifyToken(req, res, () => getMe(req, res));
      break;

    case path === '/logout' && req.method === 'GET':
      await verifyToken(req, res, () => logout(req, res));
      break;

    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: 'Route not found' }));
  }
};