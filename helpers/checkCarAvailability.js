const Car = require('../models/carModel');
const Booking = require('../models/bookingModels');

const checkCarAvailability = async (carId, pickupDate, returnDate) => {
  try {
    if (!carId || !pickupDate || !returnDate) {
      throw new Error('Car ID, pickup date, and return date are required');
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format');
    }

    if (start >= end) {
      return {
        available: false,
        message: 'Return date must be after pickup date',
      };
    }

    const car = await Car.findById(carId);
    if (!car) {
      throw new Error('Car not found');
    }

    if (car.status === 'maintenance' || car.status === 'unavailable') {
      return {
        available: false,
        message: `Car is currently ${car.status} and cannot be booked`,
      };
    }

    const conflictingBookings = await Booking.find({
      car: carId,
      status: { $nin: ['cancelled', 'completed'] },
      $or: [
        {
          pickupDate: { $lt: end },
          returnDate: { $gt: start },
        },
      ],
    }).sort('pickupDate');

    if (conflictingBookings.length > 0) {
      const unavailableRanges = conflictingBookings.map((booking) => ({
        from: booking.pickupDate,
        to: booking.returnDate,
        status: booking.status,
      }));

      return {
        available: false,
        message: `Car is not available for the selected dates`,
        unavailableRanges,
        conflictingBookings,
      };
    }

    if (car.bookings && car.bookings.length > 0) {
      const carBookingConflict = car.bookings.find((booking) => {
        if (booking.status === 'cancelled' || booking.status === 'completed') {
          return false;
        }
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        return (
          (start >= bookingStart && start <= bookingEnd) ||
          (end >= bookingStart && end <= bookingEnd) ||
          (start <= bookingStart && end >= bookingEnd)
        );
      });

      if (carBookingConflict) {
        return {
          available: false,
          message: `Car is already booked in car record`,
          conflictingBooking: carBookingConflict,
        };
      }
    }

    return {
      available: true,
      message: 'Car is available for the selected dates',
      car: {
        id: car._id,
        make: car.make,
        model: car.model,
      },
    };
  } catch (error) {
    console.error('Error in checkCarAvailability:', error);
    throw error;
  }
};

module.exports = checkCarAvailability;
