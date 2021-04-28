"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EnquiryTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EnquiryTypes.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: "enquiry_types",
      modelName: "Enquiry_types",
      paranoid: true,
      timestamps: true,
    }
  );
  return EnquiryTypes;
};
