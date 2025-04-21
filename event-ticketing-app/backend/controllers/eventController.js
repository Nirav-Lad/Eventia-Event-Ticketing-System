const Event = require('../models/Event');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event details:', error); // For server-side logging
    res.status(500).json({ error: 'Server error fetching event details' });
  }
};

// In eventController.js

exports.getEventByIdOrganizer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }

    // Fetch the event with organizer and bookings (populate user details)
    const event = await Event.findById(id).populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Fetch bookings for this event and populate user details
    const bookings = await Booking.find({ event: id }).populate('user', 'name email');

    // Send response with event details and booking info
    res.status(200).json({ event, bookings });
  } catch (error) {
    console.error('Error fetching event details:', error); // For server-side logging
    res.status(500).json({ error: 'Server error fetching event details' });
  }
};


exports.createEvent = async (req, res) => {
  const { title, description, date, location, capacity, ticketPrice} = req.body;
  console.log(req.body); // Add this in the backend event creation handler

  
  // Define the file path for qrCodeImage if it exists
  const qrCodeImage = req.file ? `/uploads/qrCodes/${req.file.filename}` : ''; 
  console.log("QR Code Image Path:", qrCodeImage); // Check the file path

  if (!title || !date || !capacity || !ticketPrice) {
    return res.status(400).json({ message: 'Title, date, capacity, and ticket price are required.' });
  }

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      capacity,
      ticketPrice,
      qrCodeImage, // Save the relative path of the QR code image here
      organizer: req.user.id
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error creating event' });
  }
};




exports.getOrganizerEvents = async (req, res) => {
  try {
    console.log('Fetching events for organizer:', req.user.id);
    const events = await Event.find({ organizer: req.user.id });
    res.status(200).json(events);
    console.log(events);  // Log the events to ensure each has an `_id` property
  } catch (error) {
    res.status(500).json({ error: 'Error fetching organizer events' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const event = await Event.findByIdAndUpdate(id, updatedData, { new: true });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error updating event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }

    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event' });
  }
};




