'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    static associate(models) {
      // Assignment.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Assignment.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      submitted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      pdf_url: {
        type: DataTypes.STRING, // Store Cloudinary URL instead of binary data
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'Assignment',
      tableName: 'Assignments',
    }
  );

  return Assignment;
};
