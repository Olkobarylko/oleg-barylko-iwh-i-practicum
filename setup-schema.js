// One-time setup: creates the "Pets" custom object (associated with contacts)
// and adds three sample records. Run with: npm run setup
require('dotenv').config();
const axios = require('axios');

const headers = {
    Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

const schema = {
    name: 'pets',
    labels: { singular: 'Pet', plural: 'Pets' },
    primaryDisplayProperty: 'name',
    requiredProperties: ['name'],
    searchableProperties: ['name', 'species'],
    properties: [
        { name: 'name', label: 'Name', type: 'string', fieldType: 'text' },
        { name: 'species', label: 'Species', type: 'string', fieldType: 'text' },
        { name: 'age', label: 'Age', type: 'number', fieldType: 'number' }
    ],
    associatedObjects: ['CONTACT']
};

const records = [
    { name: 'Barsik', species: 'Cat', age: 4 },
    { name: 'Rex', species: 'Dog', age: 6 },
    { name: 'Kesha', species: 'Parrot', age: 2 }
];

(async () => {
    try {
        const { data } = await axios.post('https://api.hubapi.com/crm/v3/schemas', schema, { headers });
        console.log(`Custom object created. objectTypeId: ${data.objectTypeId}`);
        console.log(`Put this into .env as CUSTOM_OBJECT_TYPE=${data.objectTypeId}`);

        for (const properties of records) {
            await axios.post(`https://api.hubapi.com/crm/v3/objects/${data.objectTypeId}`, { properties }, { headers });
            console.log(`Record created: ${properties.name}`);
        }
    } catch (error) {
        console.error(error.response ? error.response.data : error);
    }
})();
