const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
    },

    name: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      enum: ["google", "facebook", "github"],
      required: true,
    },

    providerId: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      default: "",
    },

    dateOfBirth: Date,

    licenseNumber: String,
    licenseExpiryDate: Date,

    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
