const Car = require('../models/carModel');

const getAllCarsController = async (req, res) => {
  try {
    const cars = await Car.find({});
    if (cars.length < 1) {
      return res.status(200).json({
        success: true,
        message: 'You do not have any cars yet',
      });
    }

    return res.status(200).json({
      success: true,
      data: cars,
    });
  } catch (error) {
    console.log(`Error in getAllCarsController: ${error}`);
    return res.status(500).json('Internal Server error');
  }
};

const addCarController = async (req, res) => {
  const {
    make,
    model,
    year,
    licensePlate,
    type,
    color,
    seats,
    transmission,
    fuelType,
    mileage,
    location,
    status,
    pricePerDay,
    features,
    images,
    description,
    totalRentals,
    averageRating,
  } = req.body;

  try {
    const newCar = new Car({
      make,
      model,
      year,
      licensePlate,
      type,
      color,
      seats,
      transmission,
      fuelType,
      mileage,
      location,
      status,
      pricePerDay,
      features,
      images,
      description,
      totalRentals,
      averageRating,
      location,
    });

    const savedCar = await newCar.save();

    return res.status(201).json({
      success: true,
      message: 'Car successfully added',
      data: savedCar,
    });
  } catch (error) {
    console.log(`Error in addCarController: ${error}`);
    return res.status(500).json('Internal Server Error');
  }
};

module.exports = { getAllCarsController, addCarController };
