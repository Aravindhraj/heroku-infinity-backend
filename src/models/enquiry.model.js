"use strict";
const { Model } = require("sequelize");
const db = require("./index");

module.exports = (sequelize, DataTypes) => {
  class Enquiry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Enquiry.init(
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      pincode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Products,
          key: "id",
        },
      },
      sales_user: {
        type: DataTypes.INTEGER,
        references: {
          model: db.User,
          key: "id",
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expected_to_buy: {
        type: DataTypes.STRING,
        allowNull: true
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(1500),
        allowNull: true
      },
      converted_to_sales: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
    },
    {
      sequelize,
      modelName: "Enquiry",
      tableName: "enquiry",
      paranoid: true,
      timestamps: true,
    }
  );
  return Enquiry;
};
