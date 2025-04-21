const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.createBooking = async (req, res) => {
  const { eventId, tickets,totalPrice } = req.body;
  console.log('Booking Data:', { user: req.user.id, event: eventId, tickets, totalPrice });


  if (!eventId || !tickets) {
    return res.status(400).json({ message: 'Event ID and number of tickets are required.' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const availableTickets = event.capacity - event.ticketsSold;
    if (tickets > availableTickets) {
      return res.status(400).json({ message: 'Not enough tickets available.' });
    }

    const totalPrice = tickets * event.ticketPrice;

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      tickets,
      totalPrice
    });

    event.ticketsSold += tickets;
    await event.save();
    await booking.save();

    res.status(201).json({
      message: 'Booking successful',
      booking: { ...booking.toObject(), totalPrice },
      qrCodeImage: event.qrCodeImage
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating booking' });
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    
    // Mark bookings with missing events as 'deleted'
    const updatedBookings = bookings.map(booking => {
      if (!booking.event) {
        return {
          ...booking.toObject(),
          deleted: true,  // Mark deleted events
        };
      }
      return booking;
    });

    res.status(200).json(updatedBookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};


// New function to fetch bookings for a specific event
exports.getEventBookings = async (req, res) => {
  const { eventId } = req.params;
  console.log('Received eventId:', eventId);
  try {
    const bookings = await Booking.find({ event: eventId });
    console.log('Fetched bookings:', bookings);
    
    // Check if bookings are found
    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this event.' });
    }

    // Send the bookings array as the response
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching event bookings:', error); // Log the error details
    res.status(500).json({ error: 'Error fetching event bookings' });
  }
};

