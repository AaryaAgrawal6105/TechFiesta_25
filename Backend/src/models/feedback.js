'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Feedback.init({
   // assignment_id: DataTypes.INTEGER,
    rubric_id: DataTypes.INTEGER,
    score: DataTypes.FLOAT,
    comments: DataTypes.TEXT,
    generated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Feedback',
  });
  return Feedback;
};