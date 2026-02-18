const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

const {
  getAllFavoritesController,
  getFavoriteByIdController,
} = require('../controllers/favouriteController');

jest.mock('../models/favoriteModel.js', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  prototype: {
    save: jest.fn(),
  },
}));

jest.mock('../models/carModel', () => ({
  findById: jest.fn(),
}));

// jest.mock('../helpers/generateBookingNumber', () => jest.fn());
// jest.mock('../helpers/checkCarAvailability', () => jest.fn());
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());

app.get('/api/favorites', getAllFavoritesController);
app.get('/api/favorites/:id', getFavoriteByIdController);

const Favorite = require('../models/favoriteModel');

describe('Favorite API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_TOKEN = 'test-secret-key';
  });

  describe('GET /api/favorites', () => {
    it('should return all favorites when favorites exist', async () => {
      const mockFavorites = [
        {
          _id: 'favorite1',
          title: 'trip1',
          user: 'user123',
          car: 'car123',
        },
        {
          _id: 'favorite2',
          title: 'trip2',
          user: 'user456',
          car: 'car456',
        },
      ];

      Favorite.find.mockResolvedValue(mockFavorites);

      const response = await request(app)
        .get('/api/favorites')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Favorite.find).toHaveBeenCalledTimes(1);
      expect(Favorite.find).toHaveBeenCalledWith({});
      expect(response.body).toEqual({
        success: true,
        data: mockFavorites,
      });
    });

    it('should return message when no favorites exist', async () => {
      Favorite.find.mockResolvedValue([]);

      const response = await request(app).get('/api/favorites').expect(200);

      expect(Favorite.find).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        success: true,
        message: 'You have no favorites yet',
      });
    });

    it('should handle database errors', async () => {
      Favorite.find.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/api/favorites').expect(500);

      expect(Favorite.find).toHaveBeenCalledTimes(1);
      expect(response.body).toBe('Internal Server Error');
    });
  });

  describe('GET /api/favorites/:id', () => {
    it('should return Favorite when valid ID is provided', async () => {
      const favoriteId = '507f1f77bcf86cd799439011';
      const mockFavorite = {
        _id: favoriteId,
        title: 'trip2',
        user: 'user456',
        car: 'car456',
      };

      Favorite.findById.mockResolvedValue(mockFavorite);

      const response = await request(app)
        .get(`/api/favorites/${favoriteId}`)
        .expect(200);

      expect(Favorite.findById).toHaveBeenCalledTimes(1);
      expect(Favorite.findById).toHaveBeenCalledWith(favoriteId);
      expect(response.body).toEqual({
        success: true,
        data: mockFavorite,
      });
    });

    it('should return 400 when Favorite is not found', async () => {
      const favoriteId = 'nonexistent123';
      Favorite.findById.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/favorites/${favoriteId}`)
        .expect(400);

      expect(Favorite.findById).toHaveBeenCalledWith(favoriteId);
      expect(response.body).toEqual({
        success: false,
        message: 'Bad request Favorite not found',
      });
    });

    it('should handle database errors', async () => {
      const favoriteId = '507f1f77bcf86cd799439011';
      Favorite.findById.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get(`/api/favorites/${favoriteId}`)
        .expect(500);

      expect(response.body).toBe('Internal Server Error');
    });
  });
});
