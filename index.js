// Import Express and some dependencies;
const express = require('express');
const cors = require('cors');

// Initialize the app;
const app = express();
// Allows Cross-Origin Resource Sharing for this app.
app.use(cors())

// Assign a port where the app is exposed.
const port = process.env.PORT || 8080;

 // For now, we just need to log each request received.
// Globe Labs requires the endpoint to send a 200 OK status.
app.get('/', (req, res) => {
    console.log(req.query);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
