const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const Jimp = require('jimp');
const path = require("path");

// Enable CORS
app.use(cors({
    origin: [],
    credentials: true, // enable set cookie
  }));

// Enable file upload limits
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);

// Serves index.html page
app.use(express.static('public'));

// Default route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Upload route
app.post('/upload', (req, res) => {
    // Get the file that was set to our field named "image"
    const { image } = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    // Change the file extension to .myjpeg
    image.name = image.name.substr(0, image.name.lastIndexOf(".")) + ".myjpeg";

    // Move the uploaded image to upload folder
    // This is where the API call to the tier3 service will be made
    image.mv(__dirname + '/upload/' + image.name);

    // log it
    console.log(req.files);

    // // All good
    // res.sendStatus(200);

    res.redirect('/');
});

app.get('/upload/:imageName', (req, res) => {
    // Get the image name from the request params
    const { imageName } = req.params;
    // Serve the image
    res.sendFile(path.join(__dirname, '/upload/', imageName));
});

// Get image names route
app.get('/images', (req, res) => {
    // Get the names of the images in the upload folder
    fs.readdir(__dirname + '/upload', (err, files) => {
        if (err) return res.sendStatus(500);

        // Send the list of image names
        res.send(files);
    });
});

// Start our server
const port = process.env.PORT || 3009;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});  