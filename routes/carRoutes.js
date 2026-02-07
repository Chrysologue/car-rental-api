const { Router } = require('express');
const {
  getAllCarsController,
  addCarController,
  getCarByIdController,
  updateCarController,
  deleteCarController,
} = require('../controllers/carController.js');

const carRouter = Router();

carRouter.get('/', getAllCarsController);
carRouter.post('/', addCarController);
carRouter.get('/:id', getCarByIdController);
carRouter.put('/:id', updateCarController);
carRouter.delete('/:id', deleteCarController);

module.exports = carRouter;
