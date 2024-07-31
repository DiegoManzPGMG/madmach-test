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
  app.post('/saveChecksum', async (req, res) => {
    try {
      const { documentId, checksum } = req.body;
  
      const newChecksum = new MD5Checksums({ documentId, checksum });
      await newChecksum.save();
      res.status(200).send('Checksum saved successfully');
    } catch (err) {
      res.status(500).send('Error saving checksum');
    }
  });

app.get('/hi', (req, res) => {
    console.log("Success")
    res.status(200).send('Checksum saved successfully');
  });
  
  // Start the server
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  