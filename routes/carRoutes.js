const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/adminMiddleware');
const utilities = require('../middleware/errorMiddleware');

const {
  getAllCarsController,
  addCarController,
  getCarByIdController,
  updateCarController,
  deleteCarController,
} = require('../controllers/carController.js');
const {
  mongoIdValidation,
  handleValidationErrors,
} = require('../middleware/validationMiddleware.js');

const carRouter = Router();

carRouter.get('/', utilities.handleAsyncError(getAllCarsController));

carRouter.post(
  '/',
  authMiddleware.verifyUser,
  checkAdmin,
  mongoIdValidation,
  handleValidationErrors,
  updateCarController,
  utilities.handleAsyncError(addCarController),
);
carRouter.get(
  '/:id',
  mongoIdValidation,
  handleValidationErrors,
  utilities.handleAsyncError(getCarByIdController),
);

carRouter.put(
  '/:id',
  authMiddleware.verifyUser,
  checkAdmin,
  mongoIdValidation,
  handleValidationErrors,
  utilities.handleAsyncError(updateCarController),
);

carRouter.delete(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  checkAdmin,
  handleValidationErrors,
  utilities.handleAsyncError(deleteCarController),
);

module.exports = carRouter;
