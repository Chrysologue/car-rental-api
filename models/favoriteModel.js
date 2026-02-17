const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Favorites must belong to a user'],
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Favorites must have a car'],
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
