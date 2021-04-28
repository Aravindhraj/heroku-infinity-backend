'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sales_lead", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      enquiry_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "enquiry",
          key: "id",
        },
        allowNull: true,
      },
      lead_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lead_category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      age: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: false
      },
      alternate_contact: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_category: {
        type: Sequelize.INTEGER,
        references: {
          model: "categories",
          key: "id",
        },
        allowNull: false,
      },
      product_subcategory: {
        type: Sequelize.INTEGER,
        references: {
          model: "subcategories",
          key: "id",
        },
        allowNull: false,
      },
      product: {
        type: Sequelize.INTEGER,
        references: {
          model: "products",
          kye: "id"
        },
        allowNull: false
      },
      product_user: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      finance_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      advance_payment: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0
      },
      buying_date: {
        type: Sequelize.STRING,
        allowNull: false
      },
      priority: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sales_executive: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          kye: "id"
        },
        allowNull: false
      },
      delivery_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales_lead');
  }
};
