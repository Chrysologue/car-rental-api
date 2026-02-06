const Car = require('../models/car');

// GET all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars); // Status 200 for success
  } catch (err) {
    res.status(500).json({ message: err.message }); // Status 500 for server error
  }
};

// POST a new car
exports.createCar = async (req, res) => {
  const car = new Car(req.body);
  try {
    const newCar = await car.save();
    res.status(201).json(newCar); // Status 201 for resource created
  } catch (err) {
    res.status(400).json({ message: "Validation Error: " + err.message }); // Status 400 for bad request
  }
};

// PUT (Update) a car by ID
exports.updateCar = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCar) return res.status(404).json({ message: "Car not found" });
    res.status(204).send(); // Status 204 for successful update with no content returned
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a car by ID
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};