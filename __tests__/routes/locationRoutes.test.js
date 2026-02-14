const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Location = require('../../models/locationModel');
const User = require('../../models/userModel');
const { generateToken, mockOAuthUser } = require('../setup');

describe('Location Routes - GET endpoints with OAuth', () => {
  let userToken;
  let adminToken;
  let testLocation;
  let userId;
  let adminId;

  beforeEach(async () => {
    const regularUser = await User.create({
      oauthId: 'google-user-loc-123',
      email: 'user.loc@example.com',
      name: 'Regular User',
      provider: 'google',
      role: 'user',
    });
    userId = regularUser._id;
    userToken = generateToken(userId, 'user');

    // Create admin OAuth user
    const adminUser = await User.create({
      oauthId: 'google-admin-loc-123',
      email: 'admin.loc@example.com',
      name: 'Admin User',
      provider: 'google',
      role: 'admin',
    });
    adminId = adminUser._id;
    adminToken = generateToken(adminId, 'admin');

    // Create test locations
    testLocation = await Location.create({
      name: 'Downtown Branch',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1234567890',
      email: 'downtown@example.com',
      openingHours: '9AM-6PM',
      coordinates: {
        lat: 40.7128,
        lng: -74.006,
      },
    });

    await Location.create({
      name: 'Airport Branch',
      address: '456 Airport Rd',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      phone: '+1234567891',
      email: 'airport@example.com',
      openingHours: '24/7',
      coordinates: {
        lat: 40.6413,
        lng: -73.7781,
      },
    });

    await Location.create({
      name: 'Uptown Branch',
      address: '789 Broadway',
      city: 'New York',
      state: 'NY',
      zipCode: '10003',
      phone: '+1234567892',
      email: 'uptown@example.com',
      openingHours: '8AM-8PM',
      coordinates: {
        lat: 40.8075,
        lng: -73.9626,
      },
    });
  });

  describe('GET /api/locations', () => {
    it('should return all locations (public access)', async () => {
      const response = await request(app).get('/api/locations').expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(3);
    });

    it('should filter locations by city', async () => {
      const response = await request(app)
        .get('/api/locations?city=New York')
        .expect(200);

      expect(response.body.data.length).toBe(3);
    });

    it('should return empty array when no locations match filter', async () => {
      const response = await request(app)
        .get('/api/locations?city=Los Angeles')
        .expect(200);

      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/locations/:id', () => {
    it('should return location by ID', async () => {
      const response = await request(app)
        .get(`/api/locations/${testLocation._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testLocation._id.toString());
      expect(response.body.data.name).toBe('Downtown Branch');
      expect(response.body.data.coordinates).toBeDefined();
    });

    it('should return 404 for non-existent location', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/locations/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/locations/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/locations/city/:city', () => {
    it('should return locations by city name', async () => {
      const response = await request(app)
        .get('/api/locations/city/New York')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(3);
    });

    it('should return empty array for city with no locations', async () => {
      const response = await request(app)
        .get('/api/locations/city/Unknown City')
        .expect(200);

      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/locations/nearby', () => {
    it('should find locations near coordinates', async () => {
      const response = await request(app)
        .get('/api/locations/nearby')
        .query({
          lat: 40.7128,
          lng: -74.006,
          radius: 10000, // 10km radius
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 400 if coordinates missing', async () => {
      const response = await request(app)
        .get('/api/locations/nearby')
        .query({ radius: 10000 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
