const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const utilities = require('../middleware/errorMiddleware');
const passport = require('passport');
require('../config/passport');

// router.post('/login', utilities.handleAsyncError(authMiddleware.login));

router.get(
  '/auth/login',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  utilities.handleAsyncError(authMiddleware.generateToken),
);
module.exports = router;
