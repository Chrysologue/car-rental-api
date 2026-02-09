const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const utilities = require('../middleware/errorMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/adminMiddleware');
const authorizeUserOrAdmin = require('../middleware/authorizeUser');

// GET all users -> Maps to GET /api/users
router.get(
  '/',
  authMiddleware.verifyUser,
  checkAdmin,
  userController.getAllUser,
);

// POST create user -> Maps to POST /api/users
router.post('/', utilities.handleAsyncError(userController.createUser));

// GET single user -> Maps to GET /api/users/:id
router.get(
  '/:id',
  authMiddleware.verifyUser,
  authorizeUserOrAdmin,
  utilities.handleAsyncError(userController.getUserById),
);

// PUT update user -> Maps to PUT /api/users/:id
router.put(
  '/:id',
  authMiddleware.verifyUser,
  authorizeUserOrAdmin,
  utilities.handleAsyncError(userController.updateUser)
);

// DELETE user -> Maps to DELETE /api/users/:id
router.delete(
  '/:id',
  authMiddleware.verifyUser,
  checkAdmin,
  utilities.handleAsyncError(userController.deleteUser),
);

module.exports = router;