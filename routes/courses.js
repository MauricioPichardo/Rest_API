'use strict'
const express = require('express');
const router = express.Router();
const Course = require('../models/').Course;
var bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const auth = require('basic-auth');
const { Op } = require("sequelize");
const authenticateUser= require('./authentication');
const User = require('../models/').User;

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

/* Returns all Courses. */
router.get("/", asyncHandler(async(req, res) => {
  try {
    const courses = await Course.findAll({
  include: [
    {
      model: User,
    },
  ],
});
        courses.every(course => course instanceof Course);
        res.end(JSON.stringify(courses, null, 2));
  } catch(error) {
    throw error
  }
}));

//New course wiht Authentication -working
router.post('/', authenticateUser,async(req, res) => {
  const errors = [];

  // Validate that we have a `name` value.
  if (!req.body.title) {
    errors.push('Please provide a value for "title"');
  }

  // Validate that we have an `email` value.
  if (!req.body.description) {
    errors.push('Please provide a value for "description"');
  }
  if (errors.length > 0) {
  // Return the validation errors to the client.
  res.status(400).json({ errors });
} else {

  let course;
  try {
      course = await Course.create({
                title: req.body.title,
                description: req.body.description,
                estimatedTime: req.body.estimatedTime,
                materialsNeeded: req.body.materialsNeeded,
                userId: req.body.userId
              });
      let id=course.id
      res.location(`/courses/${id}`);
      return res.status(201).end();

  } catch(error) {
    if(error.name === "SequelizeValidationError") {
      course = await Course.build({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded,
        userId: req.body.userId
      });
      let id=course.id
      res.location(`/courses/${id}`);
      return res.status(201).end();

    } else {
      throw error;
    }
  }}
});


/* get individual coursek =*/
router.get('/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
  if(course) {
    res.json({
      title: course.title,
      description: course.description,
      estimatedTime: course.estimatedTime,
      materialsNeeded: course.materialsNeeded,
      userId: course.userId

    });
    return res.status(201).end();
  } else {
    res.sendStatus(404);
  }
}));


//update course wiht Authentication
router.put('/:id', authenticateUser,async(req, res) => {
  const errors = [];

  // Validate that we have a `name` value.
  if (!req.body.title) {
    errors.push('Please provide a value for "title"');
  }

  // Validate that we have an `email` value.
  if (!req.body.description) {
    errors.push('Please provide a value for "description"');
  }
  if (errors.length > 0) {
  // Return the validation errors to the client.
  res.status(400).json({ errors });
} else {

  let course;
  try {
        course=await Course.findByPk(req.params.id);
        await course.update({  title: req.body.title,
                                      description: req.body.description,
                                      estimatedTime: req.body.estimatedTime,
                                      materialsNeeded: req.body.materialsNeeded,
                                      userId: req.body.userId});

        return res.status(204).end();
  } catch (error) {
      if(error.name === "SequelizeValidationError") {
        course=await Course.findByPk(req.params.id);
        await course.update({  title: req.body.title,
                                      description: req.body.description,
                                      estimatedTime: req.body.estimatedTime,
                                      materialsNeeded: req.body.materialsNeeded,
                                      userId: req.body.userId});

        return res.status(204).end();
    } else {
            throw error
          }}}});





/* Delete course  */
router.delete('/:id', authenticateUser,asyncHandler(async (req ,res) => {
  try {
  const course = await Course.findByPk(req.params.id);
    await course.destroy();
    res.status(204).end();

  } catch (error) {
          return  next(error)
        };
      }
    ));


module.exports = router;
