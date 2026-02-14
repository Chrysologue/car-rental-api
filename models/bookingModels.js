const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Booking must have a car'],
    },

    pickupLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Pickup location is required'],
    },

    returnLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Return location is required'],
    },

    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },

    returnDate: {
      type: Date,
      required: [true, 'Return date is required'],
    },

    duration: {
      type: Number,
      min: 1,
    },

    dailyRate: {
      type: Number,
      required: [true, 'Daily rate is required'],
    },

    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },

    insuranceOption: {
      type: String,
      enum: ['basic', 'premium', 'full'],
      default: 'basic',
    },

    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'active',
        'completed',
        'cancelled',
        'no-show',
      ],
      default: 'pending',
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partially-paid', 'refunded', 'failed'],
      default: 'pending',
    },

    paymentMethod: {
      type: String,
      enum: ['credit-card', 'debit-card', 'paypal', 'cash', 'bank-transfer'],
    },

    pickupInspection: {
      recordedBy: mongoose.Schema.Types.ObjectId,
      date: Date,
      mileage: Number,
      fuelLevel: {
        type: String,
        enum: ['full', '3/4', '1/2', '1/4', 'empty'],
      },
      notes: String,
      images: [String],
      signature: String,
    },

    returnInspection: {
      recordedBy: mongoose.Schema.Types.ObjectId,
      date: Date,
      mileage: Number,
      fuelLevel: String,
      notes: String,
      images: [String],
      damageReports: [
        {
          description: String,
          location: String,
          severity: String,
          estimatedCost: Number,
          images: [String],
        },
      ],
      cleaningFee: Number,
      lateFee: Number,
      additionalCharges: Number,
      signature: String,
    },
    bookingNumber: {
      type: String,
      unique: false,
    },
    drivers: [
      {
        name: String,
        email: String,
        phone: String,
        licenseNumber: String,
        licenseExpiry: Date,
        dateOfBirth: Date,
      },
    ],

    specialRequests: {
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },

    cancellationReason: String,
    cancellationDate: Date,
    cancellationFee: Number,

    promotionCode: String,
    loyaltyPointsUsed: Number,

    communications: [
      {
        type: {
          type: String,
          enum: ['email', 'sms', 'call', 'in-app'],
        },
        date: Date,
        subject: String,
        content: String,
        sentBy: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true },
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
