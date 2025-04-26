const Joi = require('joi');
const AppError = require('../utils/appError');

// Validate request body
exports.validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(message, 400));
    }
    next();
  };
};

// User schemas
exports.userSchemas = {
  register: Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid('user', 'admin').default('user')
  }),
  login: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),
  update: Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email()
  })
};

// Post schemas
exports.postSchemas = {
  create: Joi.object({
    title: Joi.string().required().min(5).max(100),
    content: Joi.string().required().min(10),
    isPublished: Joi.boolean().default(false)
  }),
  update: Joi.object({
    title: Joi.string().min(5).max(100),
    content: Joi.string().min(10),
    isPublished: Joi.boolean()
  })
};