"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Insurance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Insurance.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      validity: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "Insurance",
      tableName: "insurance",
    }
  );
  return Insurance;
};
