const { Router } = require('express');
const {
  getAllCarsController,
  addCarController,
} = require('../controllers/carController.js');

const carRouter = Router();

carRouter.get('/', getAllCarsController);
carRouter.post('/', addCarController);

module.exports = carRouter;
