"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Finance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Finance.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      modelName: "Finance",
      tableName: "finance",
    }
  );
  return Finance;
}