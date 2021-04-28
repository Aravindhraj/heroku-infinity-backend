"use strict";
const { Model } = require("sequelize");
const db = require("./index");

module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Products.init(
    {
      name: DataTypes.STRING,
      varient_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Varients,
          key: "id",
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Categories,
          key: "id",
        },
      },
      subcategory_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Subcategories,
          key: "id",
        },
      },
      image: DataTypes.STRING,
      colors: DataTypes.STRING,
      min_product_stock: DataTypes.INTEGER,
      max_product_stock: DataTypes.INTEGER,
      vehicle_cost: DataTypes.INTEGER,
      road_tax_cost: DataTypes.INTEGER,
      insurance_cost: DataTypes.INTEGER,
      reg_handling_cost: DataTypes.INTEGER,
      min_accessories_cost: DataTypes.INTEGER,
      extra_fitting_cost: DataTypes.INTEGER,
      total_sales_price: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: "products",
      modelName: "Products",
      paranoid: true,
      timestamps: true,
    }
  );
  return Products;
};
