"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class receipts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  receipts.init(
    {
      receipt_number: DataTypes.STRING,
      name: DataTypes.STRING,
      contact: DataTypes.STRING,
      address: DataTypes.STRING,
      payment_date: DataTypes.DATE,
      amount: DataTypes.STRING,
      card_number: DataTypes.STRING,
      bank_name: DataTypes.STRING,
      branch_name: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "receipts",
      modelName: "Receipts",
      paranoid: true,
      timestamps: true,
    }
  );
  return receipts;
};
