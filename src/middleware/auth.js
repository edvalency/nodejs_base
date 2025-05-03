const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: 'Not authorized' }));
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: 'User not found' }));
      return;
    }

    req.user = user;
    await next();
  } catch (error) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: 'Not authorized' }));
  }
};

exports.checkRole = (role) => async (req, res, next) => {
  if (req.user.role !== role) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: 'Not authorized for this role' }));
    return;
  }
  await next();
};