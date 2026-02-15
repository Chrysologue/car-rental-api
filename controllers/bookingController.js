const Booking = require('../models/bookingModels');
const jwt = require('jsonwebtoken');
const generateBookingNumber = require('../helpers/generateBookingNumber');
const Car = require('../models/carModel');
const checkCarAvailability = require('../helpers/checkCarAvailability');

const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    if (bookings.length < 1) {
      return res.status(200).json({
        success: true,
        message: 'You have no bookings yet',
      });
    }

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.log(`Error in getAllBookingsController: ${error}`);
    return res.status(500).json('Internal Server Error');
  }
};

const getGetBookingByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res
        .status(400)
        .json({ success: false, message: 'Bad request booking not found' });
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.log(`Error in getGetBookingByIdController: ${error}`);
    return res.status(500).json('Internal Server Error');
  }
};

const addBookingController = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'You need to be logged in to create a booking',
    });
  }

  const bookingNumber = await generateBookingNumber();

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
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decoded.id;

    // Check if car exists
    const carExists = await Car.findById(car);
    if (!carExists) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Check if car is available for the selected dates
    const isAvailable = await checkCarAvailability(car, pickupDate, returnDate);

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message:
          'Car is not available for the selected dates. Please choose different dates or another car.',
      });
    }

    const newBooking = new Booking({
      user: userId,
      car,
      pickupLocation,
      returnLocation,
      pickupDate,
      returnDate,
      duration,
      dailyRate,
      totalAmount,
      bookingNumber,
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      success: true,
      message: 'Booking successfully created',
      data: savedBooking,
    });
  } catch (error) {
    console.log(`Error in addBookingController: ${error}`);
    return res.status(500).json('Internal Server Error');
  }
};

const deleteBookingController = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res
        .status(400)
        .json({ success: false, message: 'Bad request booking not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking successfully deleted!',
      data: booking,
    });
  } catch (error) {
    console.log(`Error in deleteBookingController: ${error}`);
    return res.status(500).json('Internal Server Error');
  }
};

const updateBookingController = async (req, res) => {
  const { id } = req.params;
  const {
    car,
    pickupLocation,
    returnLocation,
    pickupDate,
    returnDate,
    duration,
    dailyRate,
    totalAmount,
    paidAmount,
    securityDeposit,
    insuranceOptions,
    status,
    paymentSt,
    atus,
    paymentMethod,
    pickupInspection,
    returnInspection,
    bookingNumber,
    drivers,
    specialRequests,
    cancellationReason,
    cancellationDate,
    cancellationFee,
    promotionCode,
    loyaltyPointsUsed,
    communications,
    createdAt,
    updatedAt,
    pickupInspectionRecordedBy,
    pickupInspectionDate,
    pickupInspectionMileage,
    pickupInspectionFuelLevel,
    pickupInspectionNotes,
    pickupInspectionImages,
    pickupInspectionSignature,
    returnInspectionRecordedBy,
    returnInspectionDate,
    returnInspectionMileage,
    returnInspectionFuelLevel,
    returnInspectionNotes,
    returnInspectionImages,
    returnInspectionCleaningFee,
    returnInspectionLateFee,
    returnInspectionAdditionalCharges,
    returnInspectionSignature,
    damageReportsDescription,
    damageReportsLocation,
    damageReportsSeverity,
    damageReportsEstimatedCost,
    damageReportsImages,
    driverName,
    driverEmail,
    driverPhone,
    driverLicenseNumber,
    driverLicenseExpiry,
    driverDateOfBirth,
    communicationType,
    communicationDate,
    communicationSubject,
    communicationContent,
    communicationSentBy,
  } = req.body;

  try {
    const book = await Booking.findByIdAndUpdate(
      id,
      {
        $set: {
          user: req.user.id,
          car,
          pickupLocation,
          returnLocation,
          pickupDate,
          returnDate,
          duration,
          dailyRate,
          totalAmount,
          paidAmount,
          securityDeposit,
          insuranceOptions,
          status,
          paymentSt,
          atus,
          paymentMethod,
          pickupInspection,
          returnInspection,
          bookingNumber,
          drivers,
          specialRequests,
          cancellationReason,
          cancellationDate,
          cancellationFee,
          promotionCode,
          loyaltyPointsUsed,
          communications,
          createdAt,
          updatedAt,
          pickupInspectionRecordedBy,
          pickupInspectionDate,
          pickupInspectionMileage,
          pickupInspectionFuelLevel,
          pickupInspectionNotes,
          pickupInspectionImages,
          pickupInspectionSignature,
          returnInspectionRecordedBy,
          returnInspectionDate,
          returnInspectionMileage,
          returnInspectionFuelLevel,
          returnInspectionNotes,
          returnInspectionImages,
          returnInspectionCleaningFee,
          returnInspectionLateFee,
          returnInspectionAdditionalCharges,
          returnInspectionSignature,
          damageReportsDescription,
          damageReportsLocation,
          damageReportsSeverity,
          damageReportsEstimatedCost,
          damageReportsImages,
          driverName,
          driverEmail,
          driverPhone,
          driverLicenseNumber,
          driverLicenseExpiry,
          driverDateOfBirth,
          communicationType,
          communicationDate,
          communicationSubject,
          communicationContent,
          communicationSentBy,
        },
      },
      { new: true },
    );
    if (!book) {
      return res.status(404).json({ success: false, message: 'No book found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Book successfully updated',
      data: book,
    });
  } catch (error) {
    console.error(`Error in updateBookController: ${error.message}`);
    res.status(500).json('Internal server error');
  }
};

module.exports = {
  getAllBookingsController,
  addBookingController,
  getGetBookingByIdController,
  deleteBookingController,
  updateBookingController,
};
