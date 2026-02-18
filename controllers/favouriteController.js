const Favorite = require('../models/favoriteModel');

const getAllFavoritesController = async (req, res) => {
  try {
    const favorites = await Favorite.find({});

    if (favorites.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'You have no favorites yet',
      });
    }

    return res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    console.log(`Error in getAllFavoriesController:${error.message}`);
    return res.status(500).json('Internal Server Error');
  }
};

const createFavoriteController = async (req, res) => {
  const { title, user, car, notes } = req.body;
  try {
    if (user) {
      if (user !== req.user.id) {
        return res
          .status(400)
          .json({ success: false, message: 'Incorrect user credentials' });
      }
    }

    const newFavorite = new Favorite({
      title,
      user: req.user.id,
      car,
      notes,
    });

    const savedFavorite = await newFavorite.save();

    return res.status(201).json({
      success: true,
      message: 'Favorite successfully created',
      data: savedFavorite,
    });
  } catch (error) {
    console.log(`Error in createFavoriteController:${error.message}`);
    return res.status(500).json('Internal Server Error');
  }
};

const updateFavoriteController = async (req, res) => {
  const { id } = req.params;
  const { title, user, car, notes } = req.body;
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
          title,
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
    return res.status(500).json('Internal Server Error');
  }
};

const getFavoriteByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const favorite = await Favorite.findById(id);

    if (!favorite) {
      return res
        .status(400)
        .json({ success: false, message: 'Bad request Favorite not found' });
    }

    return res.status(200).json({ success: true, data: favorite });
  } catch (error) {
    console.log(`Error in getAllFavoriteByIdController:${error.message}`);
    return res.status(500).json('Internal Server Error');
  }
};

const deleteFavoriteByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const favorite = await Favorite.findByIdAndDelete(id);

    if (!favorite) {
      return res.status(404).json({ message: 'No favorite found' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Favorite successfully deleted!' });
  } catch (error) {
    console.log(`Error in deleteFavoriteByIdController:${error.message}`);
    return res.status(500).json('Internal Server Error');
  }
};
module.exports = {
  getAllFavoritesController,
  createFavoriteController,
  updateFavoriteController,
  getFavoriteByIdController,
  deleteFavoriteByIdController,
};
