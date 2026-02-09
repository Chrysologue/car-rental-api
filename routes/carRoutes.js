const express = require('express');
const router = express.Router();
// Import your controller logic (if you moved it to a separate file)
// Or keep the functions here, but they must be attached to the router!

const Car = require('../models/carModel');

/* GET all cars */
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().populate('location');
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* POST add a car */
router.post('/', async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* GET car by ID */
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('location');
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ... repeat for PUT and DELETE using router.put and router.delete ...

// THIS IS THE LINE THAT FIXES THE CRASH:
module.exports = router;