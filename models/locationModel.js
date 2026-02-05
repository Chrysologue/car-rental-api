const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Location name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    type: {
      type: String,
      enum: ["airport", "downtown"],
      default: "standalone",
    },

    code: {
      type: String,
      uppercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },

    contactPerson: {
      name: String,
      phone: String,
      email: String,
    },

    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
      },
      surburb: {
        type: String,
        required: [true, "Surburb is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      country: {
        type: String,
        default: "",
      },
    },

    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },

    operatingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },

    airportSurcharge: {
      type: Number,
      default: 0,
    },

    afterHoursFee: {
      type: Number,
      default: 0,
    },

    oneWayFee: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isTemporarilyClosed: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        url: String,
        description: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    totalBookings: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true },
);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
