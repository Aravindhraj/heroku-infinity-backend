"use strict";
const { Model } = require("sequelize");
const db = require("./index");
module.exports = (sequelize, DataTypes) => {
  class quotations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  quotations.init(
    {
      quotation_number: DataTypes.STRING,
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Products,
          key: "id"
        },
        allowNull: false
      },
      sales_person_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.User,
          key: "id"
        },
        allowNull: false
      },
      accessories: DataTypes.STRING,
      old_vehicle_name: DataTypes.STRING,
      old_vehicle_cost: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "quotations",
      modelName: "Quoations",
      paranoid: true,
      timestamps: true,
    }
  );
  return quotations;
};
