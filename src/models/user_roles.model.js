"use strict";
const { Model } = require("sequelize");
const db = require("./index");
module.exports = (sequelize, DataTypes) => {
  class User_roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_roles.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.User,
          key: "id",
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Roles,
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "user_roles",
      modelName: "User_roles",
      timestamps: true,
    }
  );
  return User_roles;
};
