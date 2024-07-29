const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://diego:madmach123@cluster0.bq7iukp.mongodb.net/MADMACH-TEST', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());

// Define a schema and model for the checksum, specifying the collection name
const checksumSchema = new mongoose.Schema({
    documentId: String,
    checksum: String,
    timestamp: { type: Date, default: Date.now }
  }, { collection: 'MD5Checksums' });
  
const MD5Checksums = mongoose.model('MD5Checksums', checksumSchema);


// Endpoint to receive checksum data
app.post('/saveChecksum', (req, res) => {
    const { documentId, checksum } = req.body;
  
    const newChecksum = new MD5Checksums({ documentId, checksum });
    newChecksum.save((err) => {
      if (err) {
        res.status(500).send('Error saving checksum');
      } else {
        res.status(200).send('Checksum saved successfully');
      }
    });
  });
  
  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  