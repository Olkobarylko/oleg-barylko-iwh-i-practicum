require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
// The token and the custom object type ID are read from the local .env file (ignored by git).
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE; // e.g. 2-12345678 or p12345678_pets

const BASE_URL = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;
const PROPERTIES = ['name', 'species', 'age'];

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// ROUTE 1 - Homepage: get all custom object records and render them in a table
app.get('/', async (req, res) => {
    const url = `${BASE_URL}?limit=100&properties=${PROPERTIES.join(',')}`;

    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Pets | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error.response ? error.response.data : error);
        res.status(500).send('Could not load records from HubSpot.');
    }
});

// ROUTE 2 - Render the form for creating a new custom object record
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - Send the form data to HubSpot to create a new record, then redirect to the homepage
app.post('/update-cobj', async (req, res) => {
    const newRecord = {
        properties: {
            name: req.body.name,
            species: req.body.species,
            age: req.body.age
        }
    };

    try {
        await axios.post(BASE_URL, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response ? error.response.data : error);
        res.status(500).send('Could not create the record in HubSpot.');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
