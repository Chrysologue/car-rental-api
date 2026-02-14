// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');
require('dotenv').config();

const Auth = {};

// Auth.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     const userData = {
//       id: user._id,
//       email: user.email,
//       name: user.name,
//       role: user.role,
//     };
//     console.log(userData);
//     const accessToken = jwt.sign(userData, process.env.JWT_TOKEN, {
//       expiresIn: '2h',
//     });
//     res.status(200).json({ accessToken });
//   } catch (e) {
//     console.error(e.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

Auth.generateToken = async function (req, res) {
  try {
    const payload = {
      id: req.user._id,
      role: req.user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: '1h',
    });
    res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

Auth.verifyUser = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'Authentication required. Please log in to continue.' });
  }
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded;
    next();
  } catch (e) {
    if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = Auth;
