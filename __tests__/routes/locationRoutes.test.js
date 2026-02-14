const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Location = require('../../models/locationModel');

describe('Location Routes - GET Requests Only', () => {
  let testLocation1;
  let testLocation2;

  // Add test data before each test
  beforeEach(async () => {
    // Clear database
    await Location.deleteMany({});

    // Create test locations
    testLocation1 = await Location.create({
      name: 'Downtown Branch',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1234567890',
      email: 'downtown@example.com',
      openingHours: '9AM-6PM',
    });

    testLocation2 = await Location.create({
      name: 'Airport Branch',
      address: '456 Airport Rd',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      phone: '+1234567891',
      email: 'airport@example.com',
      openingHours: '24/7',
    });
  });

  // Test 1: GET all locations
  describe('GET /api/locations', () => {
    it('should return all locations', async () => {
      const response = await request(app).get('/api/locations').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].name).toBe('Downtown Branch');
      expect(response.body.data[1].name).toBe('Airport Branch');
    });

    it('should return empty array when no locations exist', async () => {
      await Location.deleteMany({});

      const response = await request(app).get('/api/locations').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  // Test 2: GET location by ID
  describe('GET /api/locations/:id', () => {
    it('should return location by ID', async () => {
      const response = await request(app)
        .get(`/api/locations/${testLocation1._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Downtown Branch');
      expect(response.body.data.address).toBe('123 Main St');
      expect(response.body.data.city).toBe('New York');
    });

    it('should return 404 if location not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/locations/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should return 400 if ID is invalid', async () => {
      const response = await request(app)
        .get('/api/locations/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
