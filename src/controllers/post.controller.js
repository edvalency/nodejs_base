const Post = require('../models/post.model');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all posts
 * @route   GET /api/v1/posts
 * @access  Public
 */
exports.getPosts = asyncHandler(async (req, res, next) => {
  // Build query
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Post.find(JSON.parse(queryStr)).populate({
    path: 'user',
    select: 'name email'
  });

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const posts = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.writeHead(200).json({
    status: 'success',
    count: posts.length,
    pagination,
    data: {
      posts
    }
  });
});

/**
 * @desc    Get single post
 * @route   GET /api/v1/posts/:id
 * @access  Public
 */
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate({
    path: 'user',
    select: 'name email'
  });

  if (!post) {
    return next(new AppError(`Post not found with id of ${req.params.id}`, 404));
  }

  res.writeHead(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

/**
 * @desc    Create new post
 * @route   POST /api/v1/posts
 * @access  Private
 */
exports.createPost = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const post = await Post.create(req.body);

  res.writeHead(201).json({
    status: 'success',
    data: {
      post
    }
  });
});

/**
 * @desc    Update post
 * @route   PUT /api/v1/posts/:id
 * @access  Private
 */
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError(`Post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is post owner
  if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError(`User ${req.user.id} is not authorized to update this post`, 401));
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.writeHead(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

/**
 * @desc    Delete post
 * @route   DELETE /api/v1/posts/:id
 * @access  Private
 */
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError(`Post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is post owner
  if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError(`User ${req.user.id} is not authorized to delete this post`, 401));
  }

  await post.deleteOne();

  res.writeHead(200).json({
    status: 'success',
    data: {}
  });
});