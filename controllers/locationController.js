const Location = require('../models/locationModel');
const mongoose = require('mongoose');
const locationCont = {};

locationCont.getAllLocations = async function (req, res) {
  try {
    const allLocations = await Location.find();

    res.status(200).json(allLocations);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

locationCont.getLocationById = async function (req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid location ID' });
    }
    const location = await Location.findById(id);
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.status(200).json(location);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

locationCont.createLocation = async (req, res) => {
  try {
    const newLocation = await Location.create(req.body);
    res.status(201).json(newLocation);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ error: e.message });
    }
    console.error(e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

locationCont.updateLocation = async function (req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid location ID' });
    }
    const updatedLocation = await Location.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res
      .status(200)
      .json({
        success: true,
        message: 'Location upated successfully',
        updatedLocation,
      });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

locationCont.deleteLocation = async function (req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid location ID' });
    }
    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = locationCont;
