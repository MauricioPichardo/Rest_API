
'use strict';
const Sequelize = require('sequelize');


module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
  firstName: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: "Required"
      }
    }
  },
  lastName: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: "Required"
      }
    }
  },
  emailAddress: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: "Required"
      }
    }
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: "Required"
      }
    }
  },
}, {sequelize});
User.associate = (models) => {
  User.hasMany(models.Course, {
    foreignKey: {
      fieldName: 'userId',
      allowNull: false,
    }
  });
};

return User;
};
