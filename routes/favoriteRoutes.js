const { Router } = require('express');
const {
  getAllFavoritesController,
  createFavoriteController,
  updateFavoriteController,
} = require('../controllers/favouriteController');
const authMiddleware = require('../middleware/authMiddleware');
const utilities = require('../middleware/errorMiddleware');
const {
  mongoIdValidation,
  handleValidationErrors,
} = require('../middleware/validationMiddleware.js');

const favoriteRouter = Router();

favoriteRouter.get(
  '/',
  authMiddleware.verifyUser,
  utilities.handleAsyncError(getAllFavoritesController),
);

favoriteRouter.post(
  '/',
  authMiddleware.verifyUser,
  utilities.handleAsyncError(createFavoriteController),
);

favoriteRouter.put(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  handleValidationErrors,
  utilities.handleAsyncError(updateFavoriteController),
);

module.exports = favoriteRouter;
