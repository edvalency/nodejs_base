const { validateBody, postSchemas } = require('../middleware/validators');
const { verifyToken } = require('../middleware/auth');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/post.controller');

exports.handlePosts = async (req, res) => {
  const path = req.url.replace('/api/v1/posts', '');
  const id = path.split('/')[1];
  
  switch (true) {
    case path === '/' && req.method === 'GET':
      await getPosts(req, res);
      break;

    case path === '/' && req.method === 'POST':
      await verifyToken(req, res, async () => {
        if (!validateBody(postSchemas.create)(req.body)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: 'Invalid input' }));
          return;
        }
        await createPost(req, res);
      });
      break;

    case id && req.method === 'GET':
      await getPost(req, res);
      break;

    case id && req.method === 'PUT':
      await verifyToken(req, res, async () => {
        if (!validateBody(postSchemas.update)(req.body)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: 'Invalid input' }));
          return;
        }
        await updatePost(req, res);
      });
      break;

    case id && req.method === 'DELETE':
      await verifyToken(req, res, () => deletePost(req, res));
      break;

    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: 'Route not found' }));
  }
};