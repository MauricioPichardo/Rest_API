const User = require('../models/').User;
var bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const auth = require('basic-auth');
const { Op } = require("sequelize");
const authorization = require('./');

const authenticateUser = async (req, res, next) => {
  let message = null;

  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name
      }
    });

    if (user) {
      const authenticated = bcrypt.compareSync(
        credentials.pass,
        user.dataValues.password
      );

      if (authenticated) {
        console.log(`Authentication successful for username: ${user.dataValues.username}`);
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.dataValues.username}`;
      }
    } else {
      message = `User not found for username: ${credentials.emailAddress}`;
    }
  } else {
    message = "Auth header not found";
  }
  if (message) {

    res.status(401).json({ message: "Access Denied" });
  } else {

    next();
  }
};


module.exports = authenticateUser;
