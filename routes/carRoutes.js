const { Router } = require('express');
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
carRouter.post('/', addCarController);
carRouter.get(
  '/:id',
  mongoIdValidation,
  handleValidationErrors,
  getCarByIdController,
);
carRouter.put(
  '/:id',
  mongoIdValidation,
  handleValidationErrors,
  updateCarController,
);
carRouter.delete(
  '/:id',
  mongoIdValidation,
  handleValidationErrors,
  deleteCarController,
);

module.exports = carRouter;