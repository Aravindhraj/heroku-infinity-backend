"use strict";
const { Model } = require("sequelize");
const db = require("./index");

module.exports = (sequelize, DataTypes) => {
  class ServiceHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ServiceHistory.init(
    {
      service_round: {
        type: DataTypes.STRING,
        allowNull: false
      },
      problem: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      product: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Products,
          key: "id"
        },
        allowNull: false
      },
      service_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      serviced_by_id: { 
        type: DataTypes.INTEGER,
        references: {
          model: db.User,
          key: "id"
        },
        allowNull: false
      },
      customer_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.User,
          key: "id"
        },
        allowNull: false
      },
      changed_part_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.SpareParts,
          key: "id"
        },
        allowNull: true
      }

    },
    {
      sequelize,
      tableName: "service_history",
      modelName: "ServiceHistory",
      paranoid: true,
      timestamps: true,
    }
  );
  return ServiceHistory;
};