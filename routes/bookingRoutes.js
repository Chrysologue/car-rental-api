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
  deleteBookingController,
  updateBookingController,
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
  authMiddleware.verifyUser,
  addBookingValidation,
  handleValidationErrors,
  addBookingController,
);

bookingRouter.put(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  addBookingValidation,
  handleValidationErrors,
  addBookingController,
);

bookingRouter.delete(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  addBookingValidation,
  handleValidationErrors,
  deleteBookingController,
);

module.exports = bookingRouter;
