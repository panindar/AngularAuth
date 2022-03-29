const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 3000;
const api = require('./routes/api');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api',api)

app.get('/', function (req, res) {
    res.send('Hello form server')
});

app.listen(PORT, console.log('server started on Port'+PORT))