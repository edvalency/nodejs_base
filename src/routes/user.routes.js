const { validateBody, userSchemas } = require('../middleware/validators');
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');

exports.handleUsers = async (req, res) => {
  const path = req.url.replace('/api/v1/users', '/');
  const id = path.split('/')[1];

  // Verify token and admin role for all user routes
  // await verifyToken(req, res, async () => {
    // await checkRole('admin')(req, res, async () => {
      switch (true) {
        case path === '/' && req.method === 'GET':
          console.log('ress');
          await getUsers(req, res);
          break;

        case path === '/' && req.method === 'POST':
          if (!validateBody(userSchemas.register)(req.body)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', message: 'Invalid input' }));
            return;
          }
          await createUser(req, res);
          break;

        case id && req.method === 'GET':
          await getUser(req, res);
          break;

        case id && req.method === 'PUT':
          if (!validateBody(userSchemas.update)(req.body)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', message: 'Invalid input' }));
            return;
          }
          await updateUser(req, res);
          break;

        case id && req.method === 'DELETE':
          await deleteUser(req, res);
          break;

        default:
          console.log('ress');
          console.log('method: '+req.method);
          console.log('path: ' + path);
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: 'Route nt found' }));
      }
    // });
  // });
};