const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/auth.controller');
const { validateBody, userSchemas } = require('../middleware/validators');
const { protect } = require('../middleware/auth');

router.post('/register', validateBody(userSchemas.register), register);
router.post('/login', validateBody(userSchemas.login), login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;