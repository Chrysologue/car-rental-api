const { Router } = require('express');
const {
  addBookingValidation,
  handleValidationErrors,
  mongoIdValidation,
} = require('../middleware/validationMiddleware');

const authMiddleware = require('../middleware/authMiddleware');

const {
  getAllBookingsController,
  addBookingController,
  getGetBookingByIdController,
} = require('../controllers/bookingController');

const bookingRouter = Router();

bookingRouter.get('/', authMiddleware.verifyUser, getAllBookingsController);

bookingRouter.get(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  addBookingValidation,
  handleValidationErrors,
  getGetBookingByIdController,
);

bookingRouter.post(
  '/',
  addBookingValidation,
  handleValidationErrors,
  authMiddleware.verifyUser,
  addBookingController,
);

bookingRouter.put(
  '/:id',
  mongoIdValidation,
  authMiddleware.verifyUser,
  addBookingValidation,
  handleValidationErrors,
  addBookingController,
);

bookingRouter.delete(
  '/:id',
  mongoIdValidation,
  authMiddleware.verifyUser,
  addBookingValidation,
  handleValidationErrors,
  addBookingController,
);

module.exports = bookingRouter;
