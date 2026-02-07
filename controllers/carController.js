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

module.exports = { getAllCarsController };
