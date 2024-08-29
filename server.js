const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');

// Connect to MongoDB
mongoose.connect('mongodb+srv://diego:madmach123@cluster0.bq7iukp.mongodb.net/MADMACH-TEST', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());

// Define a schema and model for the checksum, specifying the collection name for mongo
const checksumSchema = new mongoose.Schema({
    folderId: String,
    checksum: String,
    timestamp: { type: Date, default: Date.now }
}, { collection: 'MD5Checksums' });

const MD5Checksums = mongoose.model('MD5Checksums', checksumSchema);

app.post('/saveChecksum', async (req, res) => {
    try {
        const { folderId, checksum } = req.body;

        const latestChecksum = await MD5Checksums.findOne({ folderId }).sort({ timestamp: -1 });

        if (latestChecksum && latestChecksum.checksum === checksum) {
            return res.status(200).send('Checksum is identical to the last one, no need to save nor vectorize.');
        }

        try {
            const response = await axios.get('http://3.219.90.64:3030/run-script', {
              folderId,
                checksum
            });
            console.log('External API response:', response.data);
            const newChecksum = new MD5Checksums({ folderId, checksum });
            await newChecksum.save();

            return res.status(200).send('Checksum saved and vectorization executed successfully.');
        } catch (apiError) {
            console.error('Error calling external API:', apiError);
            return res.status(500).send('Error calling external API');
        } 
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
