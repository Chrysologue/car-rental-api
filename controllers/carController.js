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

const getCarByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);
    if (!car) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid request' });
    }

    return res.status(200).json({ success: true, data: car });
  } catch (error) {
    console.log(`Error in getCarByIdController: ${error}`);
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

const updateCarController = async (req, res) => {
  const { id } = req.params;
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
    const car = await Car.findByIdAndUpdate(
      id,
      {
        $set: {
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
        },
      },
      { new: true },
    );
    if (!Car) {
      return res.status(404).json({ success: false, message: 'No Car found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Car successfully updated',
      data: car,
    });
  } catch (error) {
    console.error(`Error in updateBookController: ${error.message}`);
    res.status(500).json('Internal server error');
  }
};

const deleteCarController = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findByIdAndDelete(id);
    if (!car) {
      return res
        .status(404)
        .json({ success: false, message: 'Car not found ' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Car successfully deleted!' });
  } catch (error) {
    console.error(`Error in deleteCarController: ${error.message}`);
    res.status(500).json('Internal server error');
  }
};

module.exports = {
  getAllCarsController,
  addCarController,
  getCarByIdController,
  updateCarController,
  deleteCarController,
};
