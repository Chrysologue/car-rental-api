const request = require('supertest');
const express = require('express');
const {
  getCarByIdController,
  getAllCarsController,
} = require('../controllers/carController');

jest.mock('../models/carModel', () => ({
  findById: jest.fn(),
  find: jest.fn(),
}));

const app = express();

app.get('/api/cars/:id', getCarByIdController);
app.get('/api/cars', getAllCarsController);

describe('GET /api/cars/:id', () => {
  const Car = require('../models/carModel');

  it('should return car when valid ID is provided', async () => {
    const mockCar = { _id: '123', make: 'Toyota' };
    Car.findById.mockResolvedValue(mockCar);

    const response = await request(app).get('/api/cars/123').expect(200);

    expect(response.body).toEqual({
      success: true,
      data: mockCar,
    });
  });

  it('should return 404 when car not found', async () => {
    Car.findById.mockResolvedValue(null);

    const response = await request(app).get('/api/cars/999').expect(404);

    expect(response.body).toEqual({
      success: false,
      message: 'Car not found',
    });
  });
});

describe('GET /api/cars', () => {
  const Car = require('../models/carModel');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all cars when cars exist', async () => {
    const mockCars = [
      { _id: '1', make: 'Toyota', model: 'Camry', year: 2022 },
      { _id: '2', make: 'Honda', model: 'Civic', year: 2023 },
      { _id: '3', make: 'Ford', model: 'Mustang', year: 2021 },
    ];

    Car.find.mockResolvedValue(mockCars);

    const response = await request(app).get('/api/cars').expect(200);

    expect(response.body).toEqual({
      success: true,
      data: mockCars,
    });
    expect(response.body.data).toHaveLength(3);
  });

  it('should return empty array when no cars exist', async () => {
    Car.find.mockResolvedValue([]);

    const response = await request(app).get('/api/cars').expect(200);

    expect(Car.find).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({
      success: true,
      data: [],
    });
    expect(response.body.data).toHaveLength(0);
  });

  it('should handle database errors gracefully', async () => {
    const errorMessage = 'Database connection failed';
    Car.find.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get('/api/cars').expect(500);

    expect(Car.find).toHaveBeenCalledTimes(1);
    expect(response.body).toBe('Internal Server error');
  });
});
