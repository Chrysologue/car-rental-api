const { Router } = require('express');
const {
  addBookingValidation,
  handleValidationErrors,
  mongoIdValidation,
} = require('../middleware/validationMiddleware');

const authMiddleware = require('../middleware/authMiddleware');
const utilities = require('../middleware/errorMiddleware');

const {
  getAllBookingsController,
  addBookingController,
  getGetBookingByIdController,
  deleteBookingController,
  updateBookingController,
} = require('../controllers/bookingController');

const bookingRouter = Router();

bookingRouter.get(
  '/',
  authMiddleware.verifyUser,
  utilities.handleAsyncError(getAllBookingsController),
);

bookingRouter.get(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  handleValidationErrors,
  utilities.handleAsyncError(getGetBookingByIdController),
);

bookingRouter.post(
  '/',
  authMiddleware.verifyUser,
  addBookingValidation,
  handleValidationErrors,
  utilities.handleAsyncError(addBookingController),
);

bookingRouter.put(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  addBookingValidation,
  handleValidationErrors,
  utilities.handleAsyncError(updateBookingController),
);

bookingRouter.delete(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  handleValidationErrors,
  utilities.handleAsyncError(deleteBookingController),
);

module.exports = bookingRouter;
