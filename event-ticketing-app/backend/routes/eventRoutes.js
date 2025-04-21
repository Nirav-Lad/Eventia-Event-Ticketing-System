const express = require('express');
const { getAllEvents, createEvent, getEventById, updateEvent, deleteEvent, getEventByIdOrganizer } = require('../controllers/eventController');
const { protectOrganizer } = require('../middleware/authMiddleware');
const { getOrganizerEvents } = require('../controllers/eventController');
const upload = require('../fileUpload'); // Update path as per your structure
const router = express.Router();

router.get('/', getAllEvents);
router.post('/', protectOrganizer, createEvent);
router.get('/my-events', protectOrganizer, getOrganizerEvents);
router.get('/:id', getEventById);
router.get('/:id/organizer', getEventByIdOrganizer);
router.put('/:id', protectOrganizer, updateEvent);
router.delete('/:id', protectOrganizer, deleteEvent);

// Inside the upload route in server or controller file
router.post('/uploadQrCode', upload.single('qrCode'), (req, res) => {
    const { ticketPrice } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'QR Code upload failed.' });
    }
  
    // Process ticketPrice and filePath if needed
    const filePath = req.file.path;
    console.log('Ticket Price:', ticketPrice);
    console.log('QR Code path:', filePath);
  
    res.status(200).json({ message: 'Data uploaded successfully', ticketPrice, filePath });
  });
  

module.exports = router;
