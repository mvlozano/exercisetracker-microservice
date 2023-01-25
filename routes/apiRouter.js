const router = require('express').Router();
const { postUser,
    deleteUser,
    getUsers,
    getUser,
    deleteUsers,
    postExercise,
    deleteExercises,
    getExercises,
    getUserExercisesLog,
    validate } = require('../controllers/userController');

//Register new user
router.post('/', validate('postUser'), postUser);

//Returns al users
router.get('/', getUsers);

//Returns specified user
router.get('/:username',validate('getUser'),getUser);

//Deletes specified user
router.delete('/:username', validate('deleteUser'), deleteUser);

//Deletes all users
router.delete('/', deleteUsers);

//Add new exercise for specified user
router.post('/:_id/exercises', validate('postExercise'), postExercise);

//Returns all exercises
router.get('/exercises', getExercises);

//Returns exercises logs for specified user
router.get('/:_id/logs', validate('getUserExercisesLog'), getUserExercisesLog);

//Deletes all exercises
router.delete('/exercises', deleteExercises);

module.exports = router;