const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const utilities = require('../middleware/errorMiddleware');

router.post('/login', utilities.handleAsyncError(authMiddleware.login));

module.exports = router;