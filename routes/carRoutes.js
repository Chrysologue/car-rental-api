const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/adminMiddleware');

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

carRouter.get('/', getAllCarsController);

carRouter.post(
  '/',
  authMiddleware.verifyUser,
  checkAdmin,
  mongoIdValidation,
  handleValidationErrors,
  updateCarController,
  addCarController,
);
carRouter.get(
  '/:id',
  mongoIdValidation,
  handleValidationErrors,
  getCarByIdController,
);

carRouter.put(
  '/:id',
  authMiddleware.verifyUser,
  checkAdmin,
  mongoIdValidation,
  handleValidationErrors,
  updateCarController,
);

carRouter.delete(
  '/:id',
  authMiddleware.verifyUser,
  mongoIdValidation,
  checkAdmin,
  handleValidationErrors,
  deleteCarController,
);

module.exports = carRouter;
