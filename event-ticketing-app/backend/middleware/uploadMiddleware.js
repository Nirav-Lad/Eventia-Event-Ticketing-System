// Example route for uploading QR code
const express = require('express');
const router = express.Router();
const upload = require('./fileUpload'); // Assuming this is the file with multer setup

router.post('/uploadQrCode', upload.single('qrCodeImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'QR Code upload failed.' });
  }
  res.status(200).json({ message: 'QR Code uploaded successfully', filePath: req.file.path });
});

module.exports = router;
