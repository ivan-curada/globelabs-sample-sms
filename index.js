// Import Express and some dependencies;
const express = require('express');
const cors = require('cors');
const axios = require('axios').default;
const { response } = require('express');

// Initialize the app;
const app = express();
// Allows Cross-Origin Resource Sharing for this app.
app.use(cors());
app.use(express.json())

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

    const SHORT_CODE = process.env.SHORT_CODE;
    const SHORT_CODE_CROSS_TELCO = process.env.SHORT_CODE_CROSS_TELCO;

    // Construct our POST request.
    const globe_labs_url = `https://developer.globelabs.com.ph/oauth/access_token?app_id=${APP_ID}&app_secret=${APP_SECRET}&code=${code}`;

    // Send it to Globe Labs!
    axios.post(globe_labs_url, {})
    .then((response) => {
        const access_token = response.data.access_token;
        const subscriber_number = response.data.subscriber_number;

        // Store this to the database!
        console.log(access_token, subscriber_number);

        res.send(`Thank you for registering your phone number. To stop receiving SMS notifications, send STOP to ${SHORT_CODE} for Globe or ${SHORT_CODE_CROSS_TELCO} for other networks.`);
    })
    .catch((err) => {
        // If there was an error, we should log it.
        console.error(err);
        response.status(500).send({ message: 'Internal Server Error'});
    })
});

app.post('/send', (req, res) => {

    // Get the access token, the subscriber number and the message from the request.
    const access_token = req.body.access_token;
    const subscriber_number = req.body.subscriber_number;
    const message = req.body.message;

    // Next, we need our app short code's last 4 digits;
    const SHORT_CODE_SUFFIX = process.env.SHORT_CODE.substr(-4);

    // Then, we need to compose our payload that we will send to Globe Labs.
    const payload = {
        outboundSMSMessageRequest: {
            outboundSMSTextMessage: {
                message: message
            },
            senderAddress: SHORT_CODE_SUFFIX,
            address: `+63${subscriber_number}`
        }
    }
    
    // Compose our url
    const url = `https://devapi.globelabs.com.ph/smsmessaging/v1/outbound/${SHORT_CODE_SUFFIX}/requests?access_token=${access_token}`;

    // Send the request via Axios.
    axios.post(url, payload, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(() => {
        // Success!
        res.send(`Message sent!`);
    })
    .catch((err) => {
        // If there was an error, we should log it.
        console.error(err);
        res.sendStatus(500);
    })

});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
