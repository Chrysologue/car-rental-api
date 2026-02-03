const locationController = require('../controllers/locationController');
// const { checkAdmin } = require('../middleware/adminMiddleware');
const express = require('express');
const router = express.Router();

router.get('/locations', locationController.getAllLocations);
router.get('/locations/:id', locationController.getLocationById);
router.post('/locations', locationController.createLocation); //Only admin (checkAdmin)
router.put('/locations/:id', locationController.updateLocation); //Only admin (checkAdmin)
router.delete('/locations/:id', locationController.deleteLocation); //Only admin (checkAdmin)

module.exports = router;
