const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Booking = require('../../models/bookingModels');
const User = require('../../models/userModel');
const Car = require('../../models/carModel');
const Location = require('../../models/locationModel');

describe('Booking Routes - GET Requests Only', () => {
  let testUser;
  let testLocation;
  let testCar;
  let testBooking1;
  let testBooking2;
  let authToken;

  // Add test data before each test
  beforeEach(async () => {
    // Clear database
    await Booking.deleteMany({});
    await User.deleteMany({});
    await Car.deleteMany({});
    await Location.deleteMany({});

    // Create test user
    testUser = await User.create({
      googleId: 'google-123456',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    });

    // Create test location
    testLocation = await Location.create({
      name: 'Test Location',
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
    });

    // Create test car
    testCar = await Car.create({
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

    // Create test bookings
    testBooking1 = await Booking.create({
      user: testUser._id,
      car: testCar._id,
      pickupLocation: testLocation._id,
      returnLocation: testLocation._id,
      pickupDate: new Date('2024-04-01'),
      returnDate: new Date('2024-04-08'),
      duration: 7,
      dailyRate: 50,
      totalAmount: 350,
      bookingNumber: 'BK-001',
      status: 'confirmed',
    });

    testBooking2 = await Booking.create({
      user: testUser._id,
      car: testCar._id,
      pickupLocation: testLocation._id,
      returnLocation: testLocation._id,
      pickupDate: new Date('2024-05-01'),
      returnDate: new Date('2024-05-08'),
      duration: 7,
      dailyRate: 50,
      totalAmount: 350,
      bookingNumber: 'BK-002',
      status: 'pending',
    });
  });

  // Test 1: GET all bookings
  describe('GET /api/bookings', () => {
    it('should return all bookings', async () => {
      const response = await request(app).get('/api/bookings').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].bookingNumber).toBe('BK-001');
      expect(response.body.data[1].bookingNumber).toBe('BK-002');
    });

    it('should return empty array when no bookings exist', async () => {
      await Booking.deleteMany({});

      const response = await request(app).get('/api/bookings').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  // Test 2: GET booking by ID
  describe('GET /api/bookings/:id', () => {
    it('should return booking by ID', async () => {
      const response = await request(app)
        .get(`/api/bookings/${testBooking1._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookingNumber).toBe('BK-001');
      expect(response.body.data.status).toBe('confirmed');
      expect(response.body.data.duration).toBe(7);
    });

    it('should return 404 if booking not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/bookings/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should return 400 if ID is invalid', async () => {
      const response = await request(app)
        .get('/api/bookings/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
