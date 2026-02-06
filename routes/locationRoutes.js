const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/adminMiddleware');
const express = require('express');
const router = express.Router();

router.get('/locations', locationController.getAllLocations);
router.get('/locations/:id', locationController.getLocationById);
//Only admin (checkAdmin)
router.post(
  '/locations',
  authMiddleware.verifyUser,
  checkAdmin,
  locationController.createLocation,
);
//Only admin (checkAdmin)
router.put(
  '/locations/:id',
  authMiddleware.verifyUser,
  checkAdmin,
  locationController.updateLocation,
);
//Only admin (checkAdmin)
router.delete(
  '/locations/:id',
  authMiddleware.verifyUser,
  checkAdmin,
  locationController.deleteLocation,
);

module.exports = router;
