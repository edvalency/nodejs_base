const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');
const { validateBody, userSchemas } = require('../middleware/validators');
const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router
  .route('/')
  .get(getUsers)
  .post(validateBody(userSchemas.register), createUser);

router
  .route('/:id')
  .get(getUser)
  .put(validateBody(userSchemas.update), updateUser)
  .delete(deleteUser);

module.exports = router;