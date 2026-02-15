const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const {
  getAllBookingsController,
  getGetBookingByIdController,
} = require('../controllers/bookingController');

jest.mock('../models/bookingModels', () => ({
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

jest.mock('../helpers/generateBookingNumber', () => jest.fn());
jest.mock('../helpers/checkCarAvailability', () => jest.fn());
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());

app.get('/api/bookings', getAllBookingsController);
app.get('/api/bookings/:id', getGetBookingByIdController);

const Booking = require('../models/bookingModels');
const Car = require('../models/carModel');

describe('Booking API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_TOKEN = 'test-secret-key';
  });

  describe('GET /api/bookings', () => {
    it('should return all bookings when bookings exist', async () => {
      const mockBookings = [
        {
          _id: 'booking1',
          user: 'user123',
          car: 'car123',
          pickupDate: '2024-03-01',
          returnDate: '2024-03-05',
          bookingNumber: 'BK-2024-0001',
          status: 'confirmed',
        },
        {
          _id: 'booking2',
          user: 'user456',
          car: 'car456',
          pickupDate: '2024-03-10',
          returnDate: '2024-03-15',
          bookingNumber: 'BK-2024-0002',
          status: 'pending',
        },
      ];

      Booking.find.mockResolvedValue(mockBookings);

      const response = await request(app)
        .get('/api/bookings')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Booking.find).toHaveBeenCalledTimes(1);
      expect(Booking.find).toHaveBeenCalledWith({});
      expect(response.body).toEqual({
        success: true,
        data: mockBookings,
      });
    });

    it('should return message when no bookings exist', async () => {
      Booking.find.mockResolvedValue([]);

      const response = await request(app).get('/api/bookings').expect(200);

      expect(Booking.find).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({
        success: true,
        message: 'You have no bookings yet',
      });
    });

    it('should handle database errors', async () => {
      Booking.find.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/api/bookings').expect(500);

      expect(Booking.find).toHaveBeenCalledTimes(1);
      expect(response.body).toBe('Internal Server Error');
    });
  });

  describe('GET /api/bookings/:id', () => {
    it('should return booking when valid ID is provided', async () => {
      const bookingId = '507f1f77bcf86cd799439011';
      const mockBooking = {
        _id: bookingId,
        user: 'user123',
        car: 'car123',
        pickupDate: '2024-03-01',
        returnDate: '2024-03-05',
        bookingNumber: 'BK-2024-0001',
        status: 'confirmed',
      };

      Booking.findById.mockResolvedValue(mockBooking);

      const response = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .expect(200);

      expect(Booking.findById).toHaveBeenCalledTimes(1);
      expect(Booking.findById).toHaveBeenCalledWith(bookingId);
      expect(response.body).toEqual({
        success: true,
        data: mockBooking,
      });
    });

    it('should return 400 when booking is not found', async () => {
      const bookingId = 'nonexistent123';
      Booking.findById.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .expect(400);

      expect(Booking.findById).toHaveBeenCalledWith(bookingId);
      expect(response.body).toEqual({
        success: false,
        message: 'Bad request booking not found',
      });
    });

    it('should handle database errors', async () => {
      const bookingId = '507f1f77bcf86cd799439011';
      Booking.findById.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .expect(500);

      expect(response.body).toBe('Internal Server Error');
    });
  });
});
