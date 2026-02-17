const { Router } = require('express');
const {
  getAllFavoritesController,
} = require('../controllers/favouriteController');
const authMiddleware = require('../middleware/authMiddleware');
const utilities = require('../middleware/errorMiddleware');

const favoriteRouter = Router();

favoriteRouter.get(
  '/',
  authMiddleware.verifyUser,
  utilities.handleAsyncError(getAllFavoritesController),
);

module.exports = favoriteRouter;
