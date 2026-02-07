const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/adminMiddleware');
const express = require('express');
const router = express.Router();
const utilities = require('../middleware/errorMiddleware');

router.get(
  '/locations',
  utilities.handleAsyncError(locationController.getAllLocations),
);
router.get(
  '/locations/:id',
  utilities.handleAsyncError(locationController.getLocationById),
);
//Only admin (checkAdmin)
router.post(
  '/locations',
  // authMiddleware.verifyUser,
  // checkAdmin,
  utilities.handleAsyncError(locationController.createLocation),
);
//Only admin (checkAdmin)
router.put(
  '/locations/:id',
  // authMiddleware.verifyUser,
  // checkAdmin,
  utilities.handleAsyncError(locationController.updateLocation),
);
//Only admin (checkAdmin)
router.delete(
  '/locations/:id',
  // authMiddleware.verifyUser,
  // checkAdmin,
  utilities.handleAsyncError(locationController.deleteLocation),
);

module.exports = router;
