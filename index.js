const express = require('express');
const port = 3000;

const app = express();
const bodyparser = require('body-parser');

require('./db');
require('./Model/user');

const authRoutes = require('./Routes/authRoutes');
const requireToken = require('./Middleware/AuthTokenRequired')

app.use(bodyparser.json());
app.use(authRoutes);

app.get('/', requireToken, (req, res) => {
    console.log(req.user);
    res.send(req.user);
})

app.listen(port, () => {
    console.log(`server is running on ${port}`)
})