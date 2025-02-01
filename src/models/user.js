'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('active', 'inactive', 'banned')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
// models/user.js
User.hasMany(Assignment, { foreignKey: 'user_id' });
Assignment.belongsTo(User, { foreignKey: 'user_id' });

Rubric.hasMany(Feedback, { foreignKey: 'rubric_id' });
Feedback.belongsTo(Rubric, { foreignKey: 'rubric_id' });

Assignment.hasMany(Feedback, { foreignKey: 'assignment_id' });
Feedback.belongsTo(Assignment, { foreignKey: 'assignment_id' });
