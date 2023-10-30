const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL).then(
    () => {
        console.log('database has connected')
    }
)
    .catch((err) => {
        console.log('Could not connect to db' + err)
    })