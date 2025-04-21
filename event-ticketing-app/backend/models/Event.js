const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  capacity: { type: Number, required: true },
  ticketsSold: { type: Number, default: 0 },
  ticketPrice: { type: Number, required: true },  // New field for ticket price
  qrCodeImage: { type: String }, // New field for QR code image URL
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});


const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
