'use strict'
const express = require('express');
const router = express.Router();
const User = require('../models/').User;
var bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const auth = require('basic-auth');
const { Op } = require("sequelize");
const authenticateUser= require('./authentication');

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
};


/* Creates a New User */
router.post('/', [
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "first name"'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "last name"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"'),
],(async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
      }
    else {
    let user;
    try {
        let basePasswod= bcrypt.hashSync(req.body.password);
        user = await User.create({
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  emailAddress: req.body.emailAddress,
                  password: basePasswod  })
                  res.location('/');
        return res.status(201).end();

    } catch(error) {
      if(error.name === "SequelizeValidationError") {
        let basePasswod= bcrypt.hashSync(req.body.password);
        user = await User.build({
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  emailAddress: req.body.emailAddress,
                  password: basePasswod });
                                    res.location('/');
        return res.status(201).end();


      } else {
        throw error;
      }
    }
  }}));


  // Route that returns the current authenticated user.
  router.get('/', authenticateUser, (req, res) => {
    const user = req.currentUser;
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  });




module.exports = router;
