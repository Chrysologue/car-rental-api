const Favorite = require('../models/favoriteModel');
const User = require('../models/userModel');

const getAllFavoritesController = async (req, res) => {
  try {
    const favorites = await Favorite.find({});

    if (favorites.length === 0) {
      return res
        .status(200)
        .json({ message: 'No favorites found', data: favorites });
    }

    return res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    console.log(`Error in getAllFavoriesController:${error.message}`);
    return res.status(500).json('Internal server error');
  }
};

module.exports = { getAllFavoritesController };
