const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'myTemporarySecretKey123!'; // Hardcoded Secret Key

exports.protectUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.protectOrganizer = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
