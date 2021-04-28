'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("sales_lead", "finance_type_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("sales_lead", "finance_type_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
