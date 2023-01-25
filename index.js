const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const db = require('./database/database');
const apiRouter = require('./routes/apiRouter');
require('dotenv').config();

// Basic configuration, Environment variables and DB connection
const PORT = process.env.PORT || 3000;
db.connect();

//Middlewares
//Enable requests from any domain
app.use(cors());
//Serving static files
app.use(express.static('public'));
//Parsing requests body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

//Routing
app.use('/api/users', apiRouter);

// Not found middleware
app.use((req, res, next) => {
  res.sendFile(`${__dirname}/views/404.html`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || 'Internal Server Error';
  }

  res.status(errCode).type('txt')
    .send(errMessage);
});

//Starts listening for requests
app.listen(PORT, () => {
  console.log('Your app is listening on port:', PORT);
})
