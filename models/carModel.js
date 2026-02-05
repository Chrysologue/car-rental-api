const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, "Car make is required"],
      trim: true,
    },

    model: {
      type: String,
      required: [true, "Car model is required"],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, "Car year is required"],
      min: [2000, "Year must be 2000 or later"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },

    licensePlate: {
      type: String,
      required: [true, "License plate is required"],
      unique: true,
      uppercase: true,
    },

    type: {
      type: String,
      enum: ["economy", "compact", "midsize", "suv", "van", "luxury", "sports"],
      default: "midsize",
    },

    color: {
      type: String,
      required: true,
    },

    seats: {
      type: Number,
      required: true,
      min: [2, "Car must have at least 2 seats"],
      max: [15, "Car cannot have more than 15 seats"],
    },

    transmission: {
      type: String,
      enum: ["automatic", "manual"],
      default: "automatic",
    },

    fuelType: {
      type: String,
      enum: ["gasoline", "diesel", "electric", "hybrid"],
      default: "gasoline",
    },

    mileage: {
      type: Number,
      required: true,
      min: [0, "Mileage cannot be negative"],
    },

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Car location is required"],
    },

    status: {
      type: String,
      enum: ["available", "rented", "maintenance", "unavailable"],
      default: "available",
    },

    pricePerDay: {
      type: Number,
      required: [true, "Daily price is required"],
      min: [0, "Price cannot be negative"],
    },

    features: [
      {
        type: String,
        enum: [
          "gps",
          "bluetooth",
          "backup-camera",
          "sunroof",
          "heated-seats",
          "child-seat",
        ],
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    totalRentals: {
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
  {
    timestamps: true,
  },
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
