require('dotenv').config();
const mongoose = require('mongoose');

//Database configuration and conection
const MONGO_URI = process.env.MONGO_URI;
exports.connect = () => {
    try {
        mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database Successfully Connected!');
        return mongoose.connection;
    } catch (error) {
       console.log('Database Connection Error:', error); 
    }
};
