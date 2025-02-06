'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      Feedback.belongsTo(models.Assignment, {
        foreignKey: 'assignment_id',
        as: 'assignment',
      });

      Feedback.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  Feedback.init(
    {
      assignment_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER, // Ensure this is defined
      rubric_id: DataTypes.INTEGER,
      score: DataTypes.FLOAT,
      comments: DataTypes.TEXT,
      generated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      modelName: 'Feedback',
    }
  );

  return Feedback;
};
