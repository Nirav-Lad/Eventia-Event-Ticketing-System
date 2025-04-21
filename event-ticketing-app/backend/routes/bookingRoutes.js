const express = require('express');
const { createBooking, getUserBookings, getEventBookings } = require('../controllers/bookingController');
const { protectUser, protectOrganizer } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protectUser, createBooking);
router.get('/user/:userId', protectUser, getUserBookings);
router.get('/event/:eventId', protectOrganizer, getEventBookings);

module.exports = router;
