// Import Express and some dependencies;
const express = require('express');
const cors = require('cors');
const axios = require('axios').default;
const { response } = require('express');

// Initialize the app;
const app = express();
// Allows Cross-Origin Resource Sharing for this app.
app.use(cors())

// Assign a port where the app is exposed.
const port = process.env.PORT || 8080;

 // For now, we just need to log each request received.
// Globe Labs requires the endpoint to send a 200 OK status.
app.get('/', (req, res) => {

    // After getting permission from the WebForm, we will receive
    // a code from Globe Labs. 
    const code = req.query.code;
    if (!code) {
        res.status(403).send({ message: 'Invalid request.'});
    };

    const APP_ID = process.env.APP_ID;
    const APP_SECRET = process.env.APP_SECRET;

    // Construct our POST request.
    const globe_labs_url = `https://developer.globelabs.com.ph/oauth/access_token?app_id=${APP_ID}&app_secret=${APP_SECRET}&code=${code}`;

    // Send it to Globe Labs!
    axios.post(globe_labs_url, {})
    .then((response) => {
        // Store this to the database!
        console.log(response.data);
        console.log(response.request);

        const access_token = response.data.access_token;
        const subscriber_number = response.data.subscriber_number;

        console.log(access_token, subscriber_number);
        res.sendStatus(200);
    })
    .catch((err) => {
        // If there was an error, we should log it.
        console.error(err);
        response.status(500).send({ message: 'Internal Server Error'});
    })
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
