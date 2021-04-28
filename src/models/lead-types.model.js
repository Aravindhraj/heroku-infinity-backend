"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LeadTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LeadTypes.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Lead_types",
      tableName: "lead_types",
      paranoid: true,
      timestamps: true,
    }
  );
  return LeadTypes;
};
