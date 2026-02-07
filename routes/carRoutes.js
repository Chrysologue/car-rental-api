const { Router } = require('express');
const { getAllCarsController } = require('../controllers/carController.js');

const carRouter = Router();

carRouter.get('/', getAllCarsController);

module.exports = carRouter;
