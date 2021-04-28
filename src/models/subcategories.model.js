"use strict";
const { Model } = require("sequelize");
const db = require("./index");

module.exports = (sequelize, DataTypes) => {
  class Subcategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subcategories.init(
    {
      name: DataTypes.STRING,
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Categories,
          key: "id",
        },
      },
      image: DataTypes.STRING,
      icon: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: "subcategories",
      modelName: "Subcategories",
      paranoid: true,
      timestamps: true,
    }
  );
  return Subcategories;
};
