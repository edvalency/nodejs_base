const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/post.controller');
const { validateBody, postSchemas } = require('../middleware/validators');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(getPosts)
  .post(protect, validateBody(postSchemas.create), createPost);

router
  .route('/:id')
  .get(getPost)
  .put(protect, validateBody(postSchemas.update), updatePost)
  .delete(protect, deletePost);

module.exports = router;