'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if necessary, e.g.:
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
      pdf_content: {
        type: DataTypes.BLOB('long'), // Store the PDF as binary data
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'Assignment',
      tableName: 'Assignments',  // Make sure this matches your actual table name
    }
  );

  return Assignment;
};
