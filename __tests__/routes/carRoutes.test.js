const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Car = require('../../models/carModel');
const Location = require('../../models/locationModel');
const User = require('../../models/userModel');
const { generateToken, mockOAuthUser } = require('../setup');

describe('Car Routes - GET endpoints with OAuth', () => {
  let userToken;
  let adminToken;
  let testLocation;
  let testCar;
  let userId;
  let adminId;

  beforeEach(async () => {
    const regularUser = await User.create({
      oauthId: 'google-user-123',
      email: 'regular@example.com',
      name: 'Regular User',
      provider: 'google',
      role: 'user',
    });
    userId = regularUser._id;
    userToken = generateToken(userId, 'user');

    const adminUser = await User.create({
      oauthId: 'google-admin-123',
      email: 'admin@example.com',
      name: 'Admin User',
      provider: 'google',
      role: 'admin',
    });
    adminId = adminUser._id;
    adminToken = generateToken(adminId, 'admin');

    testLocation = await Location.create({
      name: 'Test Location',
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      phone: '+1234567890',
    });

    testCar = await Car.create({
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      licensePlate: 'TEST123',
      color: 'Blue',
      seats: 5,
      transmission: 'automatic',
      fuelType: 'gasoline',
      mileage: 1000,
      location: testLocation._id,
      pricePerDay: 50,
      status: 'available',
      features: ['gps', 'bluetooth'],
      images: ['car1.jpg', 'car2.jpg'],
    });

    await Car.create({
      make: 'Honda',
      model: 'Accord',
      year: 2023,
      licensePlate: 'TEST456',
      color: 'Red',
      seats: 5,
      transmission: 'automatic',
      fuelType: 'hybrid',
      mileage: 500,
      location: testLocation._id,
      pricePerDay: 55,
      status: 'available',
      features: ['backup-camera', 'sunroof'],
    });
  });

  describe('GET /api/cars', () => {
    it('should return all cars (public access - no OAuth required)', async () => {
      const response = await request(app).get('/api/cars').expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should filter cars by make', async () => {
      const response = await request(app)
        .get('/api/cars?make=Toyota')
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].make).toBe('Toyota');
    });

    it('should filter cars by price range', async () => {
      const response = await request(app)
        .get('/api/cars?minPrice=40&maxPrice=60')
        .expect(200);

      expect(response.body.data.length).toBe(2);
    });

    it('should filter cars by features', async () => {
      const response = await request(app)
        .get('/api/cars?features=gps,bluetooth')
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].features).toContain('gps');
    });
  });

  describe('GET /api/cars/:id', () => {
    it('should return car by ID (public access)', async () => {
      const response = await request(app)
        .get(`/api/cars/${testCar._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testCar._id.toString());
      expect(response.body.data.make).toBe('Toyota');
    });

    it('should return 404 for non-existent car ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/cars/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should return car with populated location', async () => {
      const response = await request(app)
        .get(`/api/cars/${testCar._id}`)
        .expect(200);

      expect(response.body.data.location).toBeDefined();
      expect(response.body.data.location.name).toBe('Test Location');
    });
  });

  describe('GET /api/cars/location/:locationId', () => {
    it('should return cars by location', async () => {
      const response = await request(app)
        .get(`/api/cars/location/${testLocation._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });
  });
});
