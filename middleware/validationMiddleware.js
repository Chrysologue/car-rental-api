const { body, param, validationResult } = require('express-validator');

const addFavoriteValidation = [
  body('title').notEmpty().withMessage('Title connot be empty'),
  body('user').optional().isMongoId().withMessage('Invalid user id'),
  body('car').isMongoId().withMessage('Invalid car id'),
];

const addCarValidation = [
  body('make').notEmpty().trim().withMessage('Car make cannot be empty'),
  body('model').notEmpty().trim().withMessage('Car make cannot be empty'),
  body('year')
    .notEmpty()
    .withMessage('Year date cannot be empty')
    .isISO8601('Year should be in the format YYYY-MM-DD'),
  body('licensePlate')
    .notEmpty()
    .trim()
    .withMessage('licence plate cannot be empty'),
  body('color').notEmpty().trim().withMessage('Color cannot be empty'),
  body('seats')
    .notEmpty()
    .isInt({ min: 0 })
    .trim()
    .withMessage('Seats cannot be empty'),
  body('transmission')
    .notEmpty()
    .trim()
    .withMessage('Transmission make cannot be empty'),
  body('fuelType')
    .notEmpty()
    .trim()
    .withMessage('Fuel type make cannot be empty'),
  body('mileage')
    .notEmpty()
    .trim()
    .isInt({ min: 0 })
    .withMessage('Mileage make cannot be empty'),
  body('location').isMongoId().withMessage('Invalid location ID'),
  body('status').notEmpty().trim().withMessage('Status make cannot be empty'),
  body('pricePerDay')
    .notEmpty()
    .isInt({ min: 0 })
    .trim()
    .withMessage('Price per day cannot be empty'),
];

const addBookingValidation = [
  body('car').trim().notEmpty().withMessage('Car cannot be empty'),
  body('pickupLocation')
    .trim()
    .notEmpty()
    .withMessage('Pickup location cannot be empty'),
  body('returnLocation')
    .trim()
    .notEmpty()
    .withMessage('Return location cannot be empty'),
  body('pickupDate')
    .notEmpty()
    .withMessage('Pick Up date cannot be empty')
    .isISO8601('Pick Up date should be in the format YYYY-MM-DD'),
  body('returnDate')
    .notEmpty()
    .withMessage('Return date cannot be empty')
    .isISO8601('Return date should be in the format YYYY-MM-DD'),
  body('dailyRate')
    .trim()
    .notEmpty()
    .withMessage('Daily Rate cannot be empty')
    .isInt({ min: 0 })
    .withMessage('Daily Rate should be a number'),
  body('totalAmount')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Daily Rate cannot be empty')
    .isInt({ min: 0 })
    .withMessage('Daily Rate should be a number'),
  body('duration')
    .optional()
    .trim()
    .isInt({ min: 0 })
    .withMessage('Duration should be a number'),
  body('paidAmount')
    .optional()
    .trim()
    .isInt({ min: 0 })
    .withMessage('Paid amount should be a number'),
  body('securityDeposit')
    .optional()
    .trim()
    .isInt({ min: 0 })
    .withMessage('Security deposit should be a number'),
  body('deposited')
    .optional()
    .trim()
    .isInt({ min: 0 })
    .withMessage('Paid amount should be a number'),
  body('insurancOption')
    .optional()
    .isIn(['basic', 'premium', 'full'])
    .withMessage('Invalid insurance option'),
  body('status')
    .optional()
    .isIn([
      'pending',
      'confirmed',
      'active',
      'completed',
      'cancelled',
      'no-show',
    ])
    .withMessage('Invalid booking status'),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'partially-paid', 'refunded', 'failed'])
    .withMessage('Invalid payment status'),
  body('paymentMethod')
    .optional()
    .isIn(['credit-card', 'debit-card', 'paypal', 'cash', 'bank-transfer'])
    .withMessage('Invalid payment method status'),
  body('pickupInspection.recordedBy')
    .optional()
    .isMongoId()
    .withMessage('Recorded by must be a valid user ID'),

  body('pickupInspection.date')
    .optional()
    .isISO8601()
    .withMessage('Inspection date must be a valid date'),

  body('pickupInspection.mileage')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Mileage must be a positive number'),

  body('pickupInspection.fuelLevel')
    .optional()
    .isIn(['full', '3/4', '1/2', '1/4', 'empty'])
    .withMessage('Fuel level must be: full, 3/4, 1/2, 1/4, or empty'),

  body('pickupInspection.notes')
    .optional()
    .isString()
    .trim()
    .escape()
    .withMessage('Inspection notes must be a string'),

  body('pickupInspection.images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),

  body('pickupInspection.images.*')
    .optional()
    .isString()
    .isURL()
    .withMessage('Each image must be a valid URL'),

  body('pickupInspection.signature')
    .optional()
    .isString()
    .trim()
    .withMessage('Signature must be a string'),

  body('returnInspection.recordedBy')
    .optional()
    .isMongoId()
    .withMessage('Recorded by must be a valid user ID'),

  body('returnInspection.date')
    .optional()
    .isISO8601()
    .withMessage('Return inspection date must be a valid date'),

  body('returnInspection.mileage')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Mileage must be a positive number'),

  body('returnInspection.fuelLevel')
    .optional()
    .isIn(['full', '3/4', '1/2', '1/4', 'empty'])
    .withMessage('Fuel level must be: full, 3/4, 1/2, 1/4, or empty'),

  body('returnInspection.notes')
    .optional()
    .isString()
    .trim()
    .escape()
    .withMessage('Return inspection notes must be a string'),

  body('returnInspection.images')
    .optional()
    .isArray()
    .withMessage('Return images must be an array'),

  body('returnInspection.images.*')
    .optional()
    .isString()
    .isURL()
    .withMessage('Each return image must be a valid URL'),

  // Damage Reports Array
  body('returnInspection.damageReports')
    .optional()
    .isArray()
    .withMessage('Damage reports must be an array'),

  body('returnInspection.damageReports.*.description')
    .optional()
    .isString()
    .trim()
    .escape()
    .withMessage('Damage description must be a string'),

  body('returnInspection.damageReports.*.location')
    .optional()
    .isString()
    .trim()
    .escape()
    .withMessage('Damage location must be a string'),

  body('returnInspection.damageReports.*.severity')
    .optional()
    .isIn(['minor', 'moderate', 'severe', 'critical'])
    .withMessage(
      'Damage severity must be: minor, moderate, severe, or critical',
    ),

  body('returnInspection.damageReports.*.estimatedCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated cost must be a positive number'),

  body('returnInspection.damageReports.*.images')
    .optional()
    .isArray()
    .withMessage('Damage images must be an array'),

  body('returnInspection.damageReports.*.images.*')
    .optional()
    .isString()
    .isURL()
    .withMessage('Each damage image must be a valid URL'),

  body('returnInspection.cleaningFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cleaning fee must be a positive number'),

  body('returnInspection.lateFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Late fee must be a positive number'),

  body('returnInspection.additionalCharges')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Additional charges must be a positive number'),

  body('returnInspection.signature')
    .optional()
    .isString()
    .trim()
    .withMessage('Return signature must be a string'),

  body('drivers').optional().isArray().withMessage('Drivers must be an array'),

  body('drivers.*.name')
    .optional()
    .isString()
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 })
    .withMessage('Driver name must be between 2 and 100 characters'),

  body('drivers.*.email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Driver email must be valid'),

  body('drivers.*.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Driver phone must be valid'),

  body('drivers.*.licenseNumber')
    .optional()
    .isString()
    .trim()
    .escape()
    .withMessage('License number must be a string'),

  body('drivers.*.licenseExpiry')
    .optional()
    .isISO8601()
    .withMessage('License expiry must be a valid date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('License expiry date cannot be in the past');
      }
      return true;
    }),

  body('drivers.*.dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 21) {
        throw new Error('Driver must be at least 21 years old');
      }
      return true;
    }),

  body('specialRequests')
    .optional()
    .isString()
    .trim()
    .escape()
    .isLength({ max: 500 })
    .withMessage('Special requests cannot exceed 500 characters'),

  body('cancellationReason')
    .optional()
    .isString()
    .trim()
    .escape()
    .withMessage('Cancellation reason must be a string'),

  body('cancellationDate')
    .optional()
    .isISO8601()
    .withMessage('Cancellation date must be a valid date'),

  body('cancellationFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cancellation fee must be a positive number'),

  body('promotionCode')
    .optional()
    .isString()
    .trim()
    .escape()
    .isLength({ min: 3, max: 20 })
    .withMessage('Promotion code must be between 3 and 20 characters'),

  body('loyaltyPointsUsed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Loyalty points must be a positive integer'),

  body('communications')
    .optional()
    .isArray()
    .withMessage('Communications must be an array'),

  body('communications.*.type')
    .optional()
    .isIn(['email', 'sms', 'call', 'in-app'])
    .withMessage('Communication type must be: email, sms, call, or in-app'),

  body('communications.*.date')
    .optional()
    .isISO8601()
    .withMessage('Communication date must be a valid date'),

  body('communications.*.subject')
    .optional()
    .isString()
    .trim()
    .escape()
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),

  body('communications.*.content')
    .optional()
    .isString()
    .trim()
    .escape()
    .withMessage('Communication content must be a string'),

  body('communications.*.sentBy')
    .optional()
    .isMongoId()
    .withMessage('Sent by must be a valid user ID'),
];

const mongoIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Id cannot be empty')
    .isMongoId()
    .withMessage('Invalid Mongo ID'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  next();
};

module.exports = {
  addBookingValidation,
  handleValidationErrors,
  mongoIdValidation,
  addCarValidation,
  addFavoriteValidation,
};
