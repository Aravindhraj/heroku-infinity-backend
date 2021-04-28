'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sales_lead_accessories", {
      accessories_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "sales_lead",
          key: "id",
        },
        allowNull: false,
      },
      sales_lead_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "sales_lead",
          key: "id",
        },
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales_lead_accessories');
  }
};
