"use strict";
const { Model } = require("sequelize");
const db = require("./index");

module.exports = (sequelize, DataTypes) => {
    class ServiceSchedule extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ServiceSchedule.init(
        {
            customer_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: db.User,
                    key: "id"
                },
                allowNull: false
            },
            product: {
                type: DataTypes.INTEGER,
                references: {
                    model: db.Products,
                    key: "id"
                },
                allowNull: false
            },
            purchase_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            service_type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            service_round: {
                type: DataTypes.STRING,
                allowNull: false
            },
            service_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            service_time: {
                type: DataTypes.STRING,
                allowNull: false
            },
            notify_customer: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }

        },
        {
            sequelize,
            tableName: "service_schedule",
            modelName: "ServiceSchedule",
            paranoid: true,
            timestamps: true,
        }
    );
    return ServiceSchedule;
};