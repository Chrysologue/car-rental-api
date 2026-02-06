const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const utilities = require('../middleware/errorMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/adminMiddleware');
const authorizeUserOrAdmin = require('../middleware/authorizeUser');

router.get(
  '/users',
  authMiddleware.verifyUser,
  checkAdmin,
  userController.getAllUser,
);
router.post('/users', utilities.handleAsyncError(userController.createUser));
router.get(
  '/users/:id',
  authMiddleware.verifyUser,
  authorizeUserOrAdmin,
  utilities.handleAsyncError(userController.getUserById),
);
router.put(
  '/users/:id',
  authMiddleware.verifyUser,
  authorizeUserOrAdmin,
  utilities.handleAsyncError(userController.updateUser),
);
router.delete(
  '/users/:id',
  authMiddleware.verifyUser,
  checkAdmin,
  utilities.handleAsyncError(userController.deleteUser),
);

module.exports = router;
