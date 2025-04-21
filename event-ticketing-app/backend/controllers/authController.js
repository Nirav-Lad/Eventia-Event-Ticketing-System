const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'myTemporarySecretKey123!'; // Hardcoded Secret Key

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error signing up user' });
  }
};

exports.login = async (req, res) => {
  const { email = req.body.email.trim(),password = req.body.password.trim()} = req.body;

  try {
    // Step 1: Check if user with provided email exists
    const user = await User.findOne({ email });
    console.log(user); // Check if user is fetched correctly
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' }); // If no user found, return early
    }

    // Step 2: Check if provided password matches the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid); // Check if bcrypt comparison is correct
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' }); // If password does not match, return error
    }

    // Step 3: If email and password are valid, generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    // Send success response with token and user role
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error occurred' });
  }

};

