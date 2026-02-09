const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const Usec = {};

// Get all users
Usec.getAllUser = async function (req, res) {
  try {
    const allUsers = await User.find().select('-password'); // exclude password
    res.status(200).json(allUsers);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new user
Usec.createUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const isExisting = await User.findOne({ email });
    if (isExisting) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      name,
      role,
      password: hashedPassword,
    });

    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json(userObject);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single user by ID
Usec.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user
Usec.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const updates = { ...req.body };

    // Hash password if included
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Prevent role changes unless needed
    if (updates.role) {
      delete updates.role;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select('-password');
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user
Usec.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = Usec;