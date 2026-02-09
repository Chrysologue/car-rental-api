const Location = require('../models/locationModel');
const mongoose = require('mongoose');

const locationCont = {};

locationCont.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

locationCont.getLocationById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

    const location = await Location.findById(id);
    if (!location) return res.status(404).json({ error: 'Location not found' });

    res.status(200).json(location);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

locationCont.createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

locationCont.updateLocation = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

    const updated = await Location.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Location not found' });

    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

locationCont.deleteLocation = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

    const deleted = await Location.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Location not found' });

    res.status(200).json({ message: 'Location deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = locationCont;
