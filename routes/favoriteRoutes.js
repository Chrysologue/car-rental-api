const { Router } = require('express');
const {
  getAllFavoritesController,
} = require('../controllers/favouriteController');

const favoriteRouter = Router();

favoriteRouter.get('/', getAllFavoritesController);

module.exports = favoriteRouter;
