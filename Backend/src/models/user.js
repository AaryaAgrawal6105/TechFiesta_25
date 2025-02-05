'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the association between User and Assignment
      User.hasMany(models.Assignment, { foreignKey: 'user_id' });
      models.Assignment.belongsTo(User, { foreignKey: 'user_id' });

      // Define the association between User and Token
      User.hasMany(models.Token, { foreignKey: 'user_id' });
      models.Token.belongsTo(User, { foreignKey: 'user_id' });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
