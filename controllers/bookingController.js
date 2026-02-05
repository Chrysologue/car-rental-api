const Booking = require("../models/bookingModels");

const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    if (bookings.length < 1) {
      return res.status(200).json({
        success: true,
        message: "You have no bookings yet",
      });
    }

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.log(`Error in getAllBookingsController: ${error}`);
    return res.status(500).json("Internal Server Error");
  }
};

const addBookingController = async (req, res) => {
  const {
    car,
    pickupLocation,
    returnLocation,
    pickupDate,
    returnDate,
    duration,
    dailyRate,
    totalAmount,
  } = req.body;

  try {
    const newBooking = new Booking({
      user: req.user.id,
      car,
      pickupLocation,
      returnLocation,
      pickupDate,
      returnDate,
      duration,
      dailyRate,
      totalAmount,
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      success: true,
      message: "Booking successfully created",
      data: savedBooking,
    });
  } catch (error) {
    console.log(`Error in addBookingController: ${error}`);
    return res.status(500).json("Internal Server Error");
  }
};

module.exports = { getAllBookingsController, addBookingController };
