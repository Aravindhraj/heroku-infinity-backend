"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LeadCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LeadCategories.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: "lead_categories",
      modelName: "Lead_categories",
      paranoid: true,
      timestamps: true,
    }
  );
  return LeadCategories;
};
