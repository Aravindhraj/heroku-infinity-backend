"use strict";
const { Model } = require("sequelize");
const db = require("./index");

module.exports = (sequelize, DataTypes) => {
  class SalesLead extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SalesLead.init(
    {
      enquiry_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Enquiry,
          key: "id",
        },
        allowNull: true
      },
      lead_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lead_category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      age: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false
      },
      alternate_contact: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      pincode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      product_category: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Categories,
          key: "id",
        },
        allowNull: false,
      },
      product_subcategory: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Subcategories,
          key: "id",
        },
        allowNull: false,
      },
      product: {
        type: DataTypes.INTEGER,
        references: {
          model: db.Products,
          kye: "id"
        },
        allowNull: false
      },
      product_user: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      finance_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      payment_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      advance_payment: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0
      },
      buying_date: {
        type: DataTypes.STRING,
        allowNull: false
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sales_executive: {
        type: DataTypes.INTEGER,
        references: {
          model: db.User,
          kye: "id"
        },
        allowNull: false
      },
      delivery_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      lead_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: db.LeadCategories,
          key: "id",
        },
      },
      lead_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: db.LeadTypes,
          key: "id",
        },
      },
      payment_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: db.PaymentTypes,
          key: "id",
        },
      },
      finance_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: db.Finance,
          key: "id",
        },
      },
      document: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "sales_lead",
      modelName: "SalesLead",
      paranoid: true,
      timestamps: true,
    }
  );
  return SalesLead;
};
