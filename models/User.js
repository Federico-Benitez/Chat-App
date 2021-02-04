"use strict";
const { isStreamLike } = require("combined-stream");
const { isWeakMap } = require("lodash");
const { Model, DATE } = require("sequelize");
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
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "tiene que ser una direccion valida de email"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      imageUrl: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users"
    }
  );
  return User;
};
