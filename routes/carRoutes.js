const { Router } = require('express');
const {
  getAllCarsController,
  addCarController,
  getCarByIdController,
} = require('../controllers/carController.js');

const carRouter = Router();

carRouter.get('/', getAllCarsController);
carRouter.post('/', addCarController);
carRouter.get('/:id', getCarByIdController);

module.exports = carRouter;
