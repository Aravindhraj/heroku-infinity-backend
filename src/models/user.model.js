"use strict";
const { Model } = require("sequelize");
const db = require("./index");

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
      firstname: {
        type: DataTypes.STRING,
      },
      lastname: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      proof_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      proof_no: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      password: {
        type: DataTypes.STRING,
      },
      department_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Department,
          key: "id",
        },
        allowNull: true
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
