const { body, query, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

//Mongoose Schemas
const userSchema = require('../models/user');
const exerciseSchema = require('../models/exercise');

//Mongoose Models
const usersModel = mongoose.model('Users', userSchema);
const exercisesModel = mongoose.model('UsersExercises', exerciseSchema);

//Register a new user
const postUser = async (req, res, next) => {
    const errors = validationResult(req).array();
    const userName = req.body.username;
    console.log(userName);
    if (errors.length === 0) {
        try {
            const userDoc = usersModel({ username: userName });
            const user = await userDoc.save();
            res.json({ _id: user._id, username: user.username });
        } catch (error) {
            console.log(error);
            next(error);
        }

    } else {
        console.log(errors);
        res.status(400).json({ errors: errors });
    }
}

//Deletes specified user via params
const deleteUser = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length === 0) {
        const userName = req.params.username;
        try {
            await usersModel.deleteMany({ username: userName });
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({ errors: errors });
    }
}

//Deletes all users
const deleteUsers = async (req, res, next) => {
    try {
        const count = await usersModel.deleteMany({});
        res.status(200).send(`Deleted ${count.deletedCount} users`);
    } catch (error) {
        next(error);
    }
}

//Returns all users
const getUsers = async (req, res, next) => {
    try {
        const data = await usersModel.find({}).exec();
        res.json(data);
    } catch (error) {
        next(error);
    }
}

//Returns data for the specified user via params
const getUser = async (req, res, next) => {
    try {
        const userName = req.params.username;
        const user = await usersModel.find({ username: userName });
        res.json(user);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

/*Save exercise data fro specified user via params,
the returns user's data and exercise data.
Parses utc date to toDateString format*/
const postExercise = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length === 0) {
        const _id = req.params._id;
        let { description, duration, date } = req.body;
        if (date === undefined) {
            date = new Date();
        }
        let dateObj = new Date(date);
        try {
            const user = await usersModel.findById(_id).exec();
            const exercise = exercisesModel({
                userId: _id,
                description: description,
                duration: parseInt(duration),
                date: dateObj.valueOf()
            });
            const exData = await exercise.save();
            const utcStrDate = dateObj.toUTCString();
            let resDate = utcStrDate.substring(0,3);
            resDate+=' '+utcStrDate.substring(8,12);
            resDate+=utcStrDate.substring(5,8);
            resDate+=utcStrDate.substring(12,16);
            const resId = user._id.toString();
            const response = {
                username: user.username,
                description: exData.description,
                duration: exData.duration,
                date: resDate,
                _id: resId
            };
            console.log(response);
            res.json(response);
        } catch (error) {
            next(error);
        }
    } else {
        console.log(errors);
        res.status(400).json({ errors: errors })
    }
}

//Deletes all exercises
const deleteExercises = async (req, res, next) => {
    try {
        const count = await exercisesModel.deleteMany({});
        res.status(200).send(`Deleted ${count.deletedCount} exercises`);
    } catch (error) {
        next(error);
    }
}

//Returns all exercises
const getExercises = async (req, res, next) => {
    try {
        const data = await exercisesModel.find({});
        res.json(data);
    } catch (error) {
        next(error);
    }
}

/*Returns exercises log for specified user via params
from, to and limit are optional params sent via query
and sets the range for the exercises date and the maximum we want*/
const getUserExercisesLog = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length === 0) {
        let { from, to, limit } = req.query;
        const _id = req.params._id;
        let fromDateObj;
        if (from !== undefined) {
            fromDateObj = new Date(from);
        } else {
            fromDateObj = new Date(0)
        }
        let toDateObj;
        if (to !== undefined) {
            toDateObj = new Date(to);
        } else {
            toDateObj = new Date('2999-12-31');
        }
        limit = limit !== undefined ? parseInt(limit) : 0;
        let findConditions = { userId: _id };
        try {
            const user = await usersModel.findById(_id).exec();
            let userExercises = await exercisesModel.find(findConditions).exec();
            const count = userExercises.length;
            findConditions.date = { $gte: fromDateObj.valueOf(), $lte: toDateObj.valueOf() };
            userExercises = await exercisesModel.find(findConditions)
                .sort({ date: 'asc' })
                .select('description duration date')
                .limit(limit)
                .exec();
            const log = {
                username: user.username,
                count: count,
                _id: _id,
                log: userExercises.map((e) => {
                    return {
                        description: e.description,
                        duration: e.duration,
                        date: new Date(e.date).toDateString()
                    };
                })
            };
            console.log(log);
            res.json(log);
        } catch (error) {
            console.log(error);
            next(error);
        }
    } else {
        console.log(errors);
        res.status(400).json({ errors: errors });
    }
}

//Validates params sent via body, query or param
const validate = (func) => {
    switch (func) {
        case 'postUser': return [
            body('username')
                .exists({ checkFalsy: true }).withMessage('Username is required!')
                .trim()
        ];
        case 'getUser': return [
            param('username')
                .exists({ checkFalsy: true }).withMessage('Username is required!')
                .trim()
        ];
        case 'deleteUser': return [
            param('username')
                .exists({ checkFalsy: true }).withMessage('Username is required!')
                .trim()
        ];

        case 'postExercise': return [
            param('_id')
                .exists({ checkFalsy: true }).withMessage('Id is required!')
                .trim()
                .isAlphanumeric().withMessage('Id can only contain alphanumeric values!'),
            body('description')
                .exists({ checkFalsy: true }).withMessage('Description is required!')
                .trim(),
            body('duration')
                .exists({ checkFalsy: true }).withMessage('Duration is required!')
                .trim()
                .isInt({ min: 0 }).withMessage('Duration must be a positive integer!'),
            body('date')
                .optional({ checkFalsy: true })
                .trim()
                .isDate().withMessage('Must be a valid date!')
        ];
        case 'getUserExercisesLog': return [
            param('_id')
                .exists({ checkFalsy: true }).withMessage('Id is required!')
                .trim()
                .isAlphanumeric().withMessage('Id can only contain alphanumeric values!'),
            query('from')
                .optional()
                .trim()
                .isDate().withMessage('Invalid From Date'),
            query('to')
                .optional()
                .trim()
                .isDate().withMessage('Invalid To Date'),
            query('limit')
                .optional()
                .trim()
                .isInt({ min: 0 }).withMessage('Limit must be an positive integer')
        ];
        default: return [];
    }
}

module.exports = {
    postUser: postUser,
    deleteUser: deleteUser,
    deleteUsers: deleteUsers,
    getUsers: getUsers,
    getUser: getUser,
    postExercise: postExercise,
    deleteExercises: deleteExercises,
    getExercises: getExercises,
    getUserExercisesLog: getUserExercisesLog,
    validate: validate
}