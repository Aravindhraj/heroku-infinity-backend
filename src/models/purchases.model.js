"use strict";
const { Model } = require("sequelize");
const db = require("./index");

module.exports = (sequelize, DataTypes) => {
    class Purchases extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Purchases.init(
        {
            purchase_number: {
                type: DataTypes.STRING,
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
            product_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: db.Products,
                    key: "id"
                },
                allowNull: false
            },
            purchase_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            sales_person_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: db.User,
                    key: "id"
                },
                allowNull: false
            }
        },
        {
            sequelize,
            tableName: "purchases",
            modelName: "Purchases",
            paranoid: true,
            timestamps: true,
        }
    );
    return Purchases;
}; 