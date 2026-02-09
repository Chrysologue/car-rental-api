const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { handleAsyncError } = require('../middleware/errorMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/adminMiddleware');

// Public routes
router.get('/', handleAsyncError(locationController.getAllLocations));
router.get('/:id', handleAsyncError(locationController.getLocationById));

// Admin routes
router.post('/', authMiddleware.verifyUser, checkAdmin, handleAsyncError(locationController.createLocation));
router.put('/:id', authMiddleware.verifyUser, checkAdmin, handleAsyncError(locationController.updateLocation));
router.delete('/:id', authMiddleware.verifyUser, checkAdmin, handleAsyncError(locationController.deleteLocation));

// ✅ MUST export router
module.exports = router;
