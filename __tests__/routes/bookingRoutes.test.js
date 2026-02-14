const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Booking = require('../../models/bookingModels');
const User = require('../../models/userModel');
const Car = require('../../models/carModel');
const Location = require('../../models/locationModel');
const { generateToken, mockOAuthUser } = require('../setup');

describe('Booking Routes - GET endpoints with OAuth', () => {
  let authToken;
  let userId;
  let testBooking;
  let testCar;
  let testLocation;
  let testUser;

  beforeEach(async () => {
    const oauthUser = mockOAuthUser({
      id: 'google-123456',
      emails: [{ value: 'booking.test@example.com' }],
    });

    testUser = await User.create({
      oauthId: oauthUser.id,
      email: oauthUser.emails[0].value,
      name: oauthUser.displayName,
      avatar: oauthUser.photos[0].value,
      provider: oauthUser.provider,
      role: 'user',
    });

    userId = testUser._id;
    authToken = generateToken(userId);

    testLocation = await Location.create({
      name: 'Downtown Branch',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1234567890',
      email: 'downtown@example.com',
      openingHours: '9AM-6PM',
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
    });

    testBooking = await Booking.create({
      user: userId,
      car: testCar._id,
      pickupLocation: testLocation._id,
      returnLocation: testLocation._id,
      pickupDate: new Date('2024-04-01'),
      returnDate: new Date('2024-04-08'),
      duration: 7,
      dailyRate: 50,
      totalAmount: 350,
      bookingNumber: 'BK-OAUTH-TEST-123',
      status: 'confirmed',
      paymentStatus: 'pending',
    });
  });

  describe('GET /api/bookings', () => {
    it('should return all bookings for authenticated OAuth user', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0]._id).toBe(testBooking._id.toString());
      expect(response.body.data[0].user.email).toBe('booking.test@example.com');
    });

    it('should return 401 if no OAuth token provided', async () => {
      const response = await request(app).get('/api/bookings').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(
        /authentication required|unauthorized/i,
      );
    });

    it('should return 401 with invalid OAuth token', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return empty array when user has no bookings', async () => {
      const emptyUser = await User.create({
        oauthId: 'google-789012',
        email: 'empty@example.com',
        name: 'Empty User',
        provider: 'google',
        role: 'user',
      });
      const emptyUserToken = generateToken(emptyUser._id);

      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${emptyUserToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('You have no bookings yet');
      expect(response.body.data).toEqual([]);
    });

    it('should populate references correctly', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const booking = response.body.data[0];
      expect(booking.user).toBeDefined();
      expect(booking.user.email).toBe('booking.test@example.com');
      expect(booking.car).toBeDefined();
      expect(booking.car.make).toBe('Toyota');
      expect(booking.pickupLocation).toBeDefined();
      expect(booking.pickupLocation.name).toBe('Downtown Branch');
    });
  });

  describe('GET /api/bookings/:id', () => {
    it('should return specific booking by ID for authenticated OAuth user', async () => {
      const response = await request(app)
        .get(`/api/bookings/${testBooking._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testBooking._id.toString());
      expect(response.body.data.bookingNumber).toBe('BK-OAUTH-TEST-123');
      expect(response.body.data.user.email).toBe('booking.test@example.com');
    });

    it('should return 404 for non-existent booking ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/bookings/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not found/i);
    });

    it("should return 403 when accessing another user's booking", async () => {
      const otherUser = await User.create({
        oauthId: 'google-555555',
        email: 'other@example.com',
        name: 'Other User',
        provider: 'google',
        role: 'user',
      });

      const otherBooking = await Booking.create({
        user: otherUser._id,
        car: testCar._id,
        pickupLocation: testLocation._id,
        returnLocation: testLocation._id,
        pickupDate: new Date('2024-05-01'),
        returnDate: new Date('2024-05-08'),
        duration: 7,
        dailyRate: 50,
        totalAmount: 350,
        bookingNumber: 'BK-OTHER-123',
      });

      const response = await request(app)
        .get(`/api/bookings/${otherBooking._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/unauthorized|permission/i);
    });

    it('should return 400 for invalid MongoDB ID', async () => {
      const response = await request(app)
        .get('/api/bookings/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings/available-cars', () => {
    it('should return available cars for date range (public access)', async () => {
      const response = await request(app)
        .get('/api/bookings/available-cars')
        .query({
          pickupDate: '2024-04-10',
          returnDate: '2024-04-15',
          location: testLocation._id.toString(),
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBeDefined();
    });

    it('should return 400 if dates not provided', async () => {
      const response = await request(app)
        .get('/api/bookings/available-cars')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(
        /pickup date and return date are required/i,
      );
    });

    it('should filter cars by location', async () => {
      const response = await request(app)
        .get('/api/bookings/available-cars')
        .query({
          pickupDate: '2024-04-10',
          returnDate: '2024-04-15',
          location: testLocation._id.toString(),
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((car) => {
        expect(car.location._id || car.location).toBe(
          testLocation._id.toString(),
        );
      });
    });
  });
});
