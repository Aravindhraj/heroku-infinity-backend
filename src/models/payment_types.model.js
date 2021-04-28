"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PaymentTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PaymentTypes.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: "payment_types",
      modelName: "Payment_types",
      paranoid: true,
      timestamps: true,
    }
  );
  return PaymentTypes;
};
