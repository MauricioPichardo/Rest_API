const Sequelize = require('sequelize');


module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
  title: {
    type: Sequelize.CHAR,
    validate: {
      notEmpty: {
        msg: "Title Required"
      }
    }
  },
  description: {
    type: Sequelize.CHAR,
    validate: {
      notEmpty: {
        msg: "Required"
      }
    }
  },
  estimatedTime: {
    type: Sequelize.STRING,
    allowNull: true
  },
  materialsNeeded: {
    type: Sequelize.STRING,
    allowNull: true
  },
  materialsNeeded: {
    type: Sequelize.STRING,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false},
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false}
}, {sequelize});
Course.associate = (models) => {
Course.belongsTo(models.User, {
			foreignKey: {
				fieldName: 'userId',
				allowNull: false
			}})
};
return Course
};
