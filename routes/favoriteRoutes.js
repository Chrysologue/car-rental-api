const { Router } = require('express');
const {
  getAllFavoritesController,
  createFavoriteController,
  updateFavoriteController,
  getFavoriteByIdController,
  deleteFavoriteByIdController,
} = require('../controllers/favouriteController');
const authMiddleware = require('../middleware/authMiddleware');
const utilities = require('../middleware/errorMiddleware');
const {
  mongoIdValidation,
  addFavoriteValidation,
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
  addFavoriteValidation,
  handleValidationErrors,
  utilities.handleAsyncError(createFavoriteController),
);

favoriteRouter.put(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  addFavoriteValidation,
  handleValidationErrors,
  utilities.handleAsyncError(updateFavoriteController),
);

favoriteRouter.get(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  handleValidationErrors,
  utilities.handleAsyncError(getFavoriteByIdController),
);

favoriteRouter.delete(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  handleValidationErrors,
  utilities.handleAsyncError(deleteFavoriteByIdController),
);

module.exports = favoriteRouter;
