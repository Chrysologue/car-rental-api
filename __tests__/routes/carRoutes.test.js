const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Car = require('../../models/carModel');
const Location = require('../../models/locationModel');

describe('Car Routes - GET Requests Only', () => {
  let testLocation;
  let testCar1;
  let testCar2;

  // Add test data before each test
  beforeEach(async () => {
    // Clear database
    await Car.deleteMany({});
    await Location.deleteMany({});

    // Create test location
    testLocation = await Location.create({
      name: 'Test Location',
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
    });

    // Create test cars
    testCar1 = await Car.create({
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      licensePlate: 'ABC123',
      color: 'Blue',
      seats: 5,
      transmission: 'automatic',
      fuelType: 'gasoline',
      mileage: 1000,
      location: testLocation._id,
      pricePerDay: 50,
      status: 'available',
    });

    testCar2 = await Car.create({
      make: 'Honda',
      model: 'Accord',
      year: 2023,
      licensePlate: 'XYZ789',
      color: 'Red',
      seats: 5,
      transmission: 'automatic',
      fuelType: 'hybrid',
      mileage: 500,
      location: testLocation._id,
      pricePerDay: 55,
      status: 'available',
    });
  });

  // Test 1: GET all cars
  describe('GET /api/cars', () => {
    it('should return all cars', async () => {
      const response = await request(app).get('/api/cars').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].make).toBe('Toyota');
      expect(response.body.data[1].make).toBe('Honda');
    });

    it('should return empty array when no cars exist', async () => {
      await Car.deleteMany({});

      const response = await request(app).get('/api/cars').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  // Test 2: GET car by ID
  describe('GET /api/cars/:id', () => {
    it('should return car by ID', async () => {
      const response = await request(app)
        .get(`/api/cars/${testCar1._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.make).toBe('Toyota');
      expect(response.body.data.model).toBe('Camry');
      expect(response.body.data.licensePlate).toBe('ABC123');
      expect(response.body.data.location.name).toBe('Test Location');
    });

    it('should return 404 if car not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/cars/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should return 400 if ID is invalid', async () => {
      const response = await request(app)
        .get('/api/cars/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
