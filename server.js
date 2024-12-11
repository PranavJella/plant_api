const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); 

const router = require('./src/routes');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Hello Node API');
})

app.listen(5000, '0.0.0.0', () => {
    console.log(`Node API is running on port 3000`)
})