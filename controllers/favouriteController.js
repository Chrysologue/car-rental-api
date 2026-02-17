const Favorite = require('../models/favoriteModel');

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

const createFavoriteController = async (req, res) => {
  const { user, car } = req.body;
  try {
    if (user) {
      if (user !== req.user.id) {
        return res
          .status(400)
          .json({ success: false, message: 'Incorrect user credentials' });
      }
    }

    const newFavorite = new Favorite({
      user: req.user.id,
      car,
    });

    const savedFavorite = await newFavorite.save();

    return res.status(201).json({
      success: true,
      message: 'Favorite successfully created',
      data: savedFavorite,
    });
  } catch (error) {
    console.log(`Error in createFavoriteController:${error.message}`);
    return res.status(500).json('Internal server error');
  }
};

const updateFavoriteController = async (req, res) => {
  const { id } = req.params;
  const { user, car, notes } = req.body;
  try {
    if (user) {
      if (user !== req.user.id) {
        return res
          .status(400)
          .json({ success: false, message: 'Incorrect user credentials' });
      }
    }
    const favorite = await Favorite.findByIdAndUpdate(
      id,
      {
        $set: {
          user: req.user.id,
          car,
          notes,
        },
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: 'Favorite successfully updated',
      data: favorite,
    });
  } catch (error) {
    console.log(`Error in updateFavoriteController:${error.message}`);
    return res.status(500).json('Internal server error');
  }
};

module.exports = {
  getAllFavoritesController,
  createFavoriteController,
  updateFavoriteController,
};
