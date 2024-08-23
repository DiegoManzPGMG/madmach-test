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

app.post('/saveChecksum', async (req, res) => {
    try {
        const { documentId, checksum } = req.body;

        const latestChecksum = await MD5Checksums.findOne({ documentId }).sort({ timestamp: -1 });

        if (latestChecksum) {
            if (latestChecksum.checksum === checksum) {
                return res.status(200).send('Checksum is identical to the last one, no need to save.');
            }
        }

        const newChecksum = new MD5Checksums({ documentId, checksum });
        await newChecksum.save();
        res.status(200).send('Checksum saved successfully');
    } catch (err) {
        console.error('Error saving checksum:', err);
        res.status(500).send('Error saving checksum');
    }
});

app.get('/hi', (req, res) => {
    console.log("Success");
    res.status(200).send('Hello!');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
