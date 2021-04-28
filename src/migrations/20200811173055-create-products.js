"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "categories",
          key: "id",
        },
        allowNull: false,
      },
      subcategory_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "subcategories",
          key: "id",
        },
        allowNull: false,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      varient_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "varients",
          key: "id",
        },
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
      },
      colors: {
        type: Sequelize.STRING,
      },
      min_product_stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      max_product_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vehicle_cost: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      road_tax_cost: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      insurance_cost: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      reg_handling_cost: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      min_accessories_cost: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      extra_fitting_cost: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_sales_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable("products");
  },
};
