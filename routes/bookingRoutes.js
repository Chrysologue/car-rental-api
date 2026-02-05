const { Router } = require("express");
const {
  addBookingValidation,
  handleValidationErrors,
  mongoIdValidation,
} = require("../middleware/validationMiddleware");
const {
  getAllBookingsController,
  addBookingController,
} = require("../controllers/bookingController");

const bookingRouter = Router();

bookingRouter.get("/", getAllBookingsController);
bookingRouter.post(
  "/",
  mongoIdValidation,
  addBookingValidation,
  handleValidationErrors,
  addBookingController,
);

module.exports = bookingRouter;
