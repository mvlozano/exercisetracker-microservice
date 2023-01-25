# API Project: Exercise Tracker for FCC
[![Run on Repl.it](https://exercisetracker-microservice.mvlozano.repl.co)

## About
My solution for the [Exercise Tracker challenge](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker) for the freeCodeCamp API and Microservice certification. It was built based on the boilerplate available [here](https://github.com/freeCodeCamp/boilerplate-project-exercisetracker/).

## Technologies
A little bit of what's inside the project:
- **Node.js** and **Express** to create the server and handle routes, requests and responses.
- **express-validator** to clean and validate the input data.
- **Mongoose** to persist all the data.

## Endpoints:

Endpoints | Description | Params
----------|-------------|-------------
POST `/api/users` | Create a new user | username* (via body)
GET `/api/users` | Return all registered users | n/a
POST `/api/users/:_id/exercises` | Add an exercise for a specific user | _id* (via params) description*, duration*, *date (via body)
GET `/api/users/:_id/logs?[from][&to][&limit]` | Return the log of a user's exercises | _id* (via params) from, to, limit (optional via query)

#### Example output:
* POST `/api/users` body.username: `Marcos` output: `{"_id":"63d0c5a3a3a757112790d9b3","username":"Marcos"}`
* GET `/api/users` output: `[{"_id":"63d034c75ea37bdfdc6c9c87","username":"fcc_test_16745893830","__v":0},{"_id":"63d034cb5ea37bdfdc6c9c89","username":"fcc_test_16745893869","__v":0},{"_id":"63d0c5a3a3a757112790d9b3","username":"Marcos","__v":0}]`
* POST `/api/users/63d0c5a3a3a757112790d9b3/exercises` output: `{"username":"Marcos","description":"test","duration":20,"date":"Wed Jan 25 2023","_id":"63d0c5a3a3a757112790d9b3"}`
* GET `/api/users/63d0c5a3a3a757112790d9b3/logs?from=1999-11-12&to=2023-01-25&limit=2` _id: `63d0c5a3a3a757112790d9b3` output: `{"username":"Marcos","count":2,"_id":"63d0c5a3a3a757112790d9b3","log":[{"description":"test","duration":20,"date":"Fri Nov 12 1999"},{"description":"test","duration":20,"date":"Wed Jan 25 2023"}]}`

## How to use:
Be sure to change the `uri` variable in `database.js` according to your own MongoDB server. It's also possible to just create a `.env` file and store this information there in order to keep it hidden and safe. Then, just run on terminal:
```
npm install
npm start
```


